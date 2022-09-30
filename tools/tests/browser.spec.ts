import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { presetNames } from '@plurid/carved-ui-core';
const story = async (page: Page, id: string, globals = '') => {
  await page.goto(
    `/iframe.html?id=${id}&viewMode=story&carved-browser-test=true&globals=${globals}`,
  );
  await expect(page.locator('#storybook-root .laboratory')).toBeVisible();
};
const audit = async (page: Page) => {
  const result = await new AxeBuilder({ page })
    .include('#storybook-root')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
};
for (const theme of presetNames)
  test(`preset ${theme} remains accessible`, async ({ page }) => {
    await story(page, 'start-carved--showcase-control');
    await page.getByRole('button', { name: theme, exact: true }).click();
    await expect(page.getByRole('button', { name: theme, exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await audit(page);
  });
test('native validation, submit, reset and disabled controls', async ({ page }) => {
  await story(page, 'testing-browser--controls-control');
  const email = page.getByRole('textbox', { name: 'Email' });
  await email.fill('invalid');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Submitted email')).toBeEmpty();
  await email.fill('updated@example.com');
  await email.press('Tab');
  await expect(email).not.toHaveAttribute('aria-invalid', 'true');
  await expect
    .poll(() => email.evaluate((element) => (element as HTMLInputElement).validity.valid))
    .toBe(true);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByLabel('Submitted email')).toHaveText('updated@example.com');
  await page.getByRole('checkbox', { name: 'Project updates' }).uncheck();
  await page.getByRole('radio', { name: 'Team', exact: true }).check();
  await page.getByRole('switch', { name: 'Notifications' }).check();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(email).toHaveValue('team@example.com');
  await expect(page.getByRole('checkbox', { name: 'Project updates' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Private', exact: true })).toBeChecked();
  await expect(page.getByRole('switch')).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  await audit(page);
});
test('keyboard collections, combobox and slider', async ({ page }) => {
  await story(page, 'testing-browser--controls-control');
  const select = page.getByRole('button', { name: /Workspace/ });
  await select.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('option', { name: 'Design', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Selected workspace')).toHaveText('engineering');
  await expect(select).toBeFocused();
  const combo = page.getByRole('combobox');
  await combo.fill('Doc');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'Documentation', exact: true })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(combo).toHaveValue('Documentation');
  const slider = page.getByRole('slider', { name: 'Volume' });
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveValue('41');
});
test('RTL tabs and visible keyboard focus', async ({ page }) => {
  await story(page, 'testing-browser--controls-control', 'direction:rtl');
  const first = page.getByRole('tab', { name: 'Overview' });
  await first.focus();
  await page.keyboard.press('ArrowLeft');
  const active = page.getByRole('tab', { name: 'Activity' });
  await expect(active).toHaveAttribute('aria-selected', 'true');
  expect(await active.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('solid');
  await audit(page);
});
test('modal focus, description, containment and restoration', async ({ page }) => {
  await story(page, 'start-carved--showcase-control');
  const trigger = page.getByRole('button', { name: 'Create project', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Create your project' });
  await expect(dialog).toHaveAccessibleDescription('Your workspace is ready for a new project.');
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Create', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
test('portals retain local depth, custom tokens and a live theme change', async ({ page }) => {
  await story(page, 'overlays-dialog--scoped-portal-theme');
  const scope = page.locator('.lab-surface');
  const background = await scope.evaluate((element) =>
    getComputedStyle(element).getPropertyValue('--carved-bg').trim(),
  );
  await page.getByRole('button', { name: 'Open themed dialog' }).click();
  const modal = page.locator('.carved-modal');
  await expect(modal).toHaveCSS('--carved-bg', background);
  await expect(modal).toHaveCSS('--carved-accent', '#92cab7');
  await page.getByRole('button', { name: 'Change theme while open' }).click();
  await expect
    .poll(() =>
      modal.evaluate((element) => getComputedStyle(element).getPropertyValue('--carved-bg').trim()),
    )
    .not.toBe(background);
  await page.keyboard.press('Escape');
});
test('mobile layout, long text and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await story(page, 'start-carved--showcase-control');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'Create project', exact: true }).click();
  const box = await page.getByRole('dialog').boundingBox();
  expect(box!.width).toBeLessThanOrEqual(358);
  await page.keyboard.press('Escape');
  await story(page, 'feedback-states--spinner-control');
  await expect(page.getByRole('progressbar')).toHaveCSS('animation-name', 'none');
  await story(page, 'actions-button--long-label');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
test('forced colors preserves controls and focus', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit does not emulate forced-colors.');
  await page.emulateMedia({ forcedColors: 'active' });
  await story(page, 'testing-browser--controls-control');
  const input = page.getByRole('textbox', { name: 'Email' });
  await input.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('checkbox', { name: 'Project updates' })).toBeFocused();
  expect(
    await page
      .locator('.carved-checkbox')
      .evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe('solid');
  await audit(page);
});
test('avatar broken image falls back to its accessible initials', async ({ page }) => {
  await story(page, 'content-surfaces--avatars');
  await expect(page.getByRole('img', { name: 'Broken image fallback' })).toHaveText('BI');
});
test('visual baseline: desktop, light and mobile', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Canonical screenshots use Chromium on macOS 15.');
  await story(page, 'start-carved--showcase-control');
  await page.mouse.move(0, 0);
  await expect(page.locator('.showcase')).toHaveScreenshot('overview-desktop.png');
  await page.getByRole('button', { name: 'light', exact: true }).click();
  await page.getByRole('heading', { level: 1 }).click();
  await page.mouse.move(0, 0);
  await expect(page.locator('.showcase')).toHaveScreenshot('overview-light.png');
  await page.getByRole('button', { name: 'ponton', exact: true }).click();
  await page.getByRole('heading', { level: 1 }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.mouse.move(0, 0);
  await expect(page.locator('.showcase')).toHaveScreenshot('overview-mobile.png');
});
