import { bundle } from 'lightningcss';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const result = bundle({
  filename: fileURLToPath(new URL('../../packages/react/src/styles.css', import.meta.url)),
  minify: true,
  targets: { chrome: 120 << 16, firefox: 121 << 16, safari: (17 << 16) | (2 << 8) },
});
await writeFile(new URL('../../packages/react/dist/styles.css', import.meta.url), result.code);

await writeFile(new URL('../../packages/react/dist/styles.d.ts', import.meta.url), 'export {};\n');
