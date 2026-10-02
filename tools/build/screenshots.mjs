// Pictures of the showcase apps, for the site's showcase page, its landing page and the README.
// Run after `pnpm build`: node tools/build/screenshots.mjs
import { spawn } from 'node:child_process';
import { copyFile, mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const port = 6031;
const root = new URL('../../', import.meta.url);
const site = new URL('apps/site/public/showcase/', root);
const docs = new URL('docs/assets/', root);

// Each app in a material of its own, showing what it is for.
const apps = [
  {
    slug: 'mail',
    name: 'post',
    theme: 'light',
    prepare: (page) => page.getByRole('row').nth(2).click(),
  },
  { slug: 'console', name: 'quarry', theme: 'night', prepare: async () => {} },
  {
    slug: 'files',
    name: 'strata',
    theme: 'ponton',
    prepare: async (page) => {
      await page.locator('.strata-item').nth(4).click();
    },
  },
];

const server = spawn('node', ['tools/build/serve.mjs', 'apps/site/dist', String(port)], {
  cwd: root,
  stdio: 'ignore',
});
try {
  for (let tries = 0; ; tries++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/`)).ok) break;
    } catch {
      if (tries > 50) throw new Error('The site did not start: run `pnpm build` first.');
      await new Promise((done) => setTimeout(done, 100));
    }
  }
  await mkdir(site, { recursive: true });
  const browser = await chromium.launch();
  for (const app of apps) {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      reducedMotion: 'reduce',
    });
    await page.addInitScript(
      (theme) => localStorage.setItem('carved-site-theme', theme),
      app.theme,
    );
    await page.goto(`http://127.0.0.1:${port}/showcase/${app.slug}`);
    await page.waitForSelector('html[data-hydrated]');
    await page.evaluate(() => document.fonts.ready);
    await app.prepare(page);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(400);
    const file = new URL(`${app.slug}.jpg`, site);
    await page.screenshot({ path: file.pathname, type: 'jpeg', quality: 84 });
    await copyFile(file, new URL(`showcase-${app.name}.jpg`, docs));
    await page.close();
  }
  await browser.close();
} finally {
  server.kill();
}
