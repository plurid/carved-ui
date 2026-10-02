// A small static server for built sites, behaving like GitHub Pages: directories serve their
// index.html, and unknown paths get 404.html when there is one.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const directory = resolve(process.argv[2] ?? 'apps/storybook/dist');
const port = Number(process.argv[3] ?? 6006);
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

async function locate(pathname) {
  const file = resolve(directory, `.${pathname}`);
  if (file !== directory && !file.startsWith(directory + sep)) return null;
  const found = await stat(file).catch(() => null);
  if (found?.isFile()) return file;
  if (found?.isDirectory())
    return (await stat(join(file, 'index.html')).catch(() => null))
      ? join(file, 'index.html')
      : null;
  return null;
}

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const file = await locate(pathname);
  const missing = file ? null : await locate('/404.html');
  const served = file ?? missing;
  if (!served) return response.writeHead(404).end('Not found');
  response
    .writeHead(file ? 200 : 404, {
      'Content-Type': types[extname(served)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    })
    .end(await readFile(served));
}).listen(port, '127.0.0.1', () => console.log(`Serving ${directory} at http://127.0.0.1:${port}`));
