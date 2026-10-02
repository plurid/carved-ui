// Develop against Carved's source: aliases the packages to src, and generates the core
// stylesheet from the theme engine so token and theme edits reload without a build.
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runnerImport } from 'vite';
import type { Plugin } from 'vite';

const root = fileURLToPath(new URL('../../', import.meta.url));
const core = `${root}packages/core/src/`;
const react = `${root}packages/react/src/`;
const generated = `${root}tools/vite/generated/core.css`;

async function writeCoreStylesheet(): Promise<string[]> {
  const { module, dependencies } = await runnerImport<{
    coreStylesheet: (material: string) => string;
  }>(`${core}css.ts`);
  const material = await readFile(`${core}material.css`, 'utf8');
  await mkdir(dirname(generated), { recursive: true });
  // Storybook, its tests and the site may generate this at once: replace it atomically, so no
  // reader ever sees a half-written file.
  const temporary = `${generated}.${process.pid}.tmp`;
  await writeFile(temporary, module.coreStylesheet(material));
  await rename(temporary, generated);
  return [`${core}css.ts`, `${core}material.css`, ...dependencies];
}

/** Every React Aria entry the components import, so Vite pre-bundles them all up front. */
async function reactAriaEntries(): Promise<string[]> {
  const entries = new Set<string>();
  for (const file of await readdir(react, { recursive: true }))
    if (/\.tsx?$/.test(file))
      for (const [, entry] of (await readFile(`${react}${file}`, 'utf8')).matchAll(
        /from '(react-aria(?:-components)?\/[\w]+)'/g,
      ))
        entries.add(entry!);
  return [...entries].sort();
}

export function carved(): Plugin {
  let sources: string[] = [];
  return {
    name: 'carved',
    enforce: 'pre',
    async config() {
      sources = await writeCoreStylesheet();
      return {
        resolve: {
          alias: [
            { find: '@plurid/carved-ui-core/styles.css', replacement: generated },
            { find: '@plurid/carved-ui-react/styles.css', replacement: `${react}styles/index.css` },
            { find: /^@plurid\/carved-ui-core$/, replacement: `${core}index.ts` },
            { find: /^@plurid\/carved-ui-react$/, replacement: `${react}index.ts` },
          ],
        },
        css: { transformer: 'lightningcss' },
        optimizeDeps: { include: ['react-aria-components', ...(await reactAriaEntries())] },
      };
    },
    configureServer(server) {
      server.watcher.add(sources);
      server.watcher.on('change', async (file) => {
        if (!sources.includes(file)) return;
        try {
          sources = await writeCoreStylesheet();
        } catch (error) {
          server.config.logger.error(`Carved stylesheet: ${(error as Error).message}`);
        }
      });
    },
  };
}
