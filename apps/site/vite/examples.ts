// `import Example, { code } from './example.tsx?example'` renders a demo and shows its source.
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { highlight } from './highlight.ts';

const query = '?example';

export function examples(): Plugin {
  return {
    name: 'carved-examples',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!source.endsWith(query)) return null;
      const resolved = await this.resolve(source.slice(0, -query.length), importer, {
        skipSelf: true,
      });
      return resolved && `${resolved.id}${query}`;
    },
    async load(id) {
      if (!id.endsWith(query)) return null;
      const file = id.slice(0, -query.length);
      this.addWatchFile(file);
      // A wrapper can point at the file it demonstrates: `// @source ../path/recipe.tsx`.
      const pointer = (await readFile(file, 'utf8')).match(/^\/\/ @source (.+)$/m)?.[1];
      const shown = pointer ? resolve(dirname(file), pointer) : file;
      if (pointer) this.addWatchFile(shown);
      // Leading comments are notes for this site, not part of the example.
      const source = (await readFile(shown, 'utf8')).replace(/^(\/\/.*\n)+/, '').trim();
      return [
        `export { default } from ${JSON.stringify(file)};`,
        `export const source = ${JSON.stringify(source)};`,
        `export const code = ${JSON.stringify(await highlight(source))};`,
      ].join('\n');
    },
  };
}
