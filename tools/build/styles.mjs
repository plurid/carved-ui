// Bundle the React stylesheet, resolving the core stylesheet through its package export.
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { bundleAsync } from 'lightningcss';
import { targets } from './targets.mjs';

const react = new URL('../../packages/react/', import.meta.url);
const require = createRequire(new URL('package.json', react));
const { code } = await bundleAsync({
  filename: fileURLToPath(new URL('src/styles/index.css', react)),
  minify: true,
  targets,
  resolver: {
    resolve: (specifier, from) =>
      specifier.startsWith('.')
        ? fileURLToPath(new URL(specifier, `file://${from}`))
        : require.resolve(specifier),
  },
});
await writeFile(new URL('dist/styles.css', react), code);
await writeFile(new URL('dist/styles.d.ts', react), 'export {};\n');
