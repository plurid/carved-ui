import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Every prerendered page of the documentation site.
const dist = fileURLToPath(new URL('../../apps/site/dist/', import.meta.url));
const pages = (readdirSync(dist, { recursive: true }) as string[])
  .filter((file) => file.endsWith('index.html') && !file.startsWith('lab'))
  .map((file) => `/${file.replace(/index\.html$/, '')}`);

test.use({ baseURL: 'http://127.0.0.1:6020' });

/** Open a page and wait until the prerendered HTML has hydrated and become interactive. */
async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
}

for (const path of pages)
  test(`site ${path} hydrates cleanly, is accessible and fits a phone`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    await open(page, path);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await page.waitForLoadState('load');
    const { violations } = await new AxeBuilder({ page })
      .exclude('[data-live-announcer]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.setViewportSize({ width: 390, height: 844 });
    // Components that size themselves with resize observers, like resizable tables, settle a
    // frame after the viewport changes.
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(390);
  });

test('the site theme can be changed and is remembered', async ({ page }) => {
  await open(page, '/components/button');
  await page.getByRole('radio', { name: 'furor' }).click();
  await expect(page.locator('.site')).toHaveAttribute('data-carved-theme', 'furor');
  await page.reload();
  await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
  await expect(page.locator('.site')).toHaveAttribute('data-carved-theme', 'furor');
});

test('the theme lab regenerates its preview', async ({ page }) => {
  await open(page, '/themes');
  const preview = page.locator('.lab-preview');
  const before = await preview.evaluate((element) => getComputedStyle(element).backgroundColor);
  const colour = page.getByRole('textbox', { name: 'Colour', exact: true });
  await colour.fill('#7a2fd0');
  await expect
    .poll(() => preview.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe(before);
  await colour.fill('not a colour');
  await expect(page.getByText('Use a CSS colour without transparency')).toBeVisible();
});

test('navigating to a component page never shows it half loaded', async ({ page }) => {
  await open(page, '/components/button/');
  // Record what the new page holds at the moment its title first appears.
  await page.evaluate(() => {
    const record = () => {
      if (document.querySelector('h1')?.textContent !== 'Date and time') return;
      (window as unknown as { stages?: number }).stages ??=
        document.querySelectorAll('.specimen-stage').length;
    };
    new MutationObserver(record).observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  });
  await page.getByRole('link', { name: 'Date and time', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as { stages?: number }).stages)).toBe(2);
});

test('client navigation keeps the page shell', async ({ page }) => {
  await open(page, '/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/\/start$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Getting started' })).toBeVisible();
  await expect(page).toHaveTitle('Getting started · Carved UI');
});
