// Render every route to static HTML, so the site works without JavaScript and loads fast.
import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const server = new URL('../dist-server/', import.meta.url);
const { render, paths, titleFor } = await import(new URL('entry-server.js', server).href);
const template = await readFile(new URL('index.html', dist), 'utf8');

const page = async (path) =>
  template
    .replace('<!--app-->', await render(path))
    .replace(/<title>.*<\/title>/, `<title>${titleFor(path)}</title>`);

for (const path of paths) {
  const directory = new URL(path === '/' ? './' : `.${path}/`, dist);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), await page(path));
}
// GitHub Pages serves 404.html for unknown paths, and Jekyll must leave the files alone.
await writeFile(new URL('404.html', dist), await page('/not-found'));
await writeFile(new URL('.nojekyll', dist), '');
await rm(server, { recursive: true, force: true });

// Publish the Storybook laboratory under /lab when it has been built.
const lab = new URL('../../storybook/dist/', import.meta.url);
if (await stat(lab).catch(() => null)) await cp(lab, new URL('lab/', dist), { recursive: true });
console.log(`Prerendered ${paths.length} pages`);
