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

test.describe('showcase', () => {
  test('Post filters five thousand messages, opens one and sends a reply', async ({ page }) => {
    await open(page, '/showcase/mail');
    const list = page.getByRole('grid', { name: 'Inbox' });
    await expect(list).toHaveAttribute('aria-rowcount', '5000');
    // Only the messages in view are rendered.
    expect(await list.getByRole('row').count()).toBeLessThan(40);
    await page.getByRole('searchbox', { name: 'Search Inbox' }).fill('lisbon');
    await expect(list.getByRole('row').first()).toContainText('Lisbon');
    await list.getByRole('row').first().click();
    const reading = page.getByRole('article');
    await expect(reading.getByRole('heading', { level: 2 })).toContainText('Lisbon');
    await reading.getByRole('textbox', { name: /Reply to/ }).fill('See you there.');
    await reading.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByText('Reply sent')).toBeVisible();
  });

  test('Post takes turns between list and message on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, '/showcase/mail');
    await page.getByRole('grid', { name: 'Inbox' }).getByRole('row').first().click();
    await expect(page.getByRole('grid', { name: 'Inbox' })).toBeHidden();
    await page.getByRole('button', { name: 'Back to Inbox' }).click();
    await expect(page.getByRole('grid', { name: 'Inbox' })).toBeVisible();
    // The mailboxes are in the drawer; choosing one goes there and closes it.
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page
      .getByRole('dialog', { name: 'Navigation' })
      .getByRole('link', { name: 'Sent' })
      .click();
    await expect(page).toHaveURL(/\/showcase\/mail\/sent$/);
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sent');
  });

  test('Quarry sorts and filters ten thousand deploys and rolls one back', async ({ page }) => {
    await open(page, '/showcase/console/deploys');
    const table = page.getByRole('grid', { name: 'Deploys' });
    await expect(table).toHaveAttribute('aria-rowcount', '10001');
    await page.getByRole('radio', { name: 'Failed' }).click();
    await expect
      .poll(async () => Number(await table.getAttribute('aria-rowcount')))
      .toBeLessThan(1000);
    await page.getByRole('radio', { name: 'All' }).click();
    await page.getByRole('columnheader', { name: /Deploy/ }).click();
    await expect(table.getByRole('rowheader').first()).toHaveText('#1');
    await table.getByRole('row').nth(3).click();
    const drawer = page.getByRole('dialog', { name: /Deploy #/ });
    await drawer.getByRole('button', { name: 'Roll back to this deploy' }).click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Roll back' }).click();
    await expect(page.getByText(/Rolled back to #/)).toBeVisible();
  });

  test('Quarry’s command palette reaches its settings', async ({ page }) => {
    await open(page, '/showcase/console');
    await page.getByRole('button', { name: /Go to/ }).click();
    await page.getByRole('searchbox', { name: 'Search commands' }).fill('sett');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/showcase\/console\/settings$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  });

  test('Strata opens folders from the tree and chooses files in the grid', async ({ page }) => {
    await open(page, '/showcase/files');
    await page
      .getByRole('treegrid', { name: 'Folders' })
      .getByRole('row', { name: 'Kyoto, spring' })
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kyoto, spring');
    await expect(
      page.getByRole('navigation', { name: /Breadcrumbs/ }).or(page.locator('.carved-breadcrumbs')),
    ).toContainText('Photos');
    const grid = page.getByRole('grid', { name: 'Kyoto, spring' });
    await grid.getByRole('row').first().click();
    await page.keyboard.down('Shift');
    await grid.getByRole('row').nth(2).click();
    await page.keyboard.up('Shift');
    await expect(page.getByText('3 chosen').first()).toBeVisible();
    await page.getByRole('radio', { name: 'List' }).click();
    await expect(page.getByRole('grid', { name: 'Kyoto, spring' })).toBeVisible();
  });
});

// Prerendering happens in UTC and English; readers are anywhere. The apps must hydrate the same.
test.describe('showcase far from UTC', () => {
  test.use({ timezoneId: 'Pacific/Kiritimati', locale: 'de-DE' });
  for (const path of pages.filter((path) => path.startsWith('/showcase/')))
    test(`${path} hydrates without mismatches`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
      await open(page, path);
      await page.waitForLoadState('load');
      expect(errors).toEqual([]);
    });
});
