// Emit core's stylesheet and DTCG tokens from the compiled theme engine.
import { readFile, writeFile } from 'node:fs/promises';
import { transform } from 'lightningcss';
import { targets } from './targets.mjs';

const dist = new URL('../../packages/core/dist/', import.meta.url);
const { coreStylesheet, toDtcg } = await import(new URL('index.js', dist).href);
const material = await readFile(new URL('../src/material.css', dist), 'utf8');
const { code } = transform({
  filename: 'styles.css',
  code: Buffer.from(coreStylesheet(material)),
  minify: true,
  targets,
});
await writeFile(new URL('styles.css', dist), code);
await writeFile(new URL('styles.d.ts', dist), 'export {};\n');
await writeFile(new URL('tokens.json', dist), `${JSON.stringify(toDtcg(), null, 2)}\n`);
