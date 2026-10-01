import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { presetNames } from '@plurid/carved-ui-core';

/** Open a story in the built Storybook. The a11y addon is muted: these tests run their own scans. */
async function story(page: Page, id: string, globals: Record<string, string> = {}) {
  const values = Object.entries({ ...globals, 'a11y.manual': '!true' })
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=${values}`);
  await expect(page.locator('#storybook-root .carved-provider').first()).toBeVisible();
}

async function audit(page: Page, { contrast = true } = {}) {
  // Let entering overlays finish fading in, so contrast is measured at full opacity.
  await expect(page.locator('[data-entering]')).toHaveCount(0);
  const { violations } = await new AxeBuilder({ page })
    .exclude('[data-live-announcer]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .disableRules(contrast ? [] : ['color-contrast'])
    .analyze();
  expect(violations).toEqual([]);
}

for (const theme of presetNames)
  test(`${theme}: the showcase and an open list are accessible`, async ({ page }) => {
    await story(page, 'start-showcase--overview', { theme });
    await page.getByRole('radio', { name: theme, exact: true }).click();
    await page.getByRole('button', { name: /Workspace/ }).click();
    await expect(page.getByRole('listbox')).toBeVisible();
    await audit(page);
  });

test('validation, submit and reset with a real pointer', async ({ page }) => {
  await story(page, 'testing-browser--controls-harness');
  const email = page.getByRole('textbox', { name: 'Email' });
  const save = page.getByRole('button', { name: 'Save', exact: true });
  await email.fill('invalid');
  await save.click();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Submitted email')).toBeEmpty();
  // Correcting the field and clicking Save straight away must submit: the error leaving on
  // blur may not move the button out from under the pointer.
  await email.fill('updated@example.com');
  await save.click();
  await expect(page.getByLabel('Submitted email')).toHaveText('updated@example.com');
  // People click the visible label; the native input sits beneath it.
  await page.getByText('Project updates', { exact: true }).click();
  await page.getByText('Team', { exact: true }).click();
  await page.getByText('Notifications', { exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'Project updates' })).not.toBeChecked();
  await expect(page.getByRole('switch', { name: 'Notifications' })).toBeChecked();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(email).toHaveValue('team@example.com');
  await expect(page.getByRole('checkbox', { name: 'Project updates' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Private' })).toBeChecked();
  await expect(page.getByRole('switch', { name: 'Notifications' })).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  await audit(page);
});

test('keyboard: select, combo box, slider and tabs', async ({ page }) => {
  await story(page, 'testing-browser--controls-harness');
  const select = page.getByRole('button', { name: /Workspace/ });
  await select.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('option', { name: 'Design' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Selected workspace')).toHaveText('engineering');
  await expect(select).toBeFocused();
  const combo = page.getByRole('combobox', { name: 'Jump to' });
  await combo.fill('Doc');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(combo).toHaveValue('Documentation');
  const slider = page.getByRole('slider', { name: 'Volume' });
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveValue('41');
  await page.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('right to left: layout and arrow keys agree', async ({ page }) => {
  await story(page, 'testing-browser--controls-harness', { locale: 'ar-EG' });
  await expect(page.locator('.carved-provider').first()).toHaveAttribute('dir', 'rtl');
  await page.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('a nested provider inherits nothing it should not, and keeps its own locale', async ({
  page,
}) => {
  await story(page, 'testing-browser--portals-harness');
  const first = page.getByRole('tab', { name: 'الأول' });
  await first.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'الثاني' })).toHaveAttribute('aria-selected', 'true');
});

test('modal: name, description, containment and restoration', async ({ page }) => {
  await story(page, 'testing-browser--portals-harness');
  const trigger = page.getByRole('button', { name: 'Rename project' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Rename project' });
  await expect(dialog).toHaveAccessibleDescription('The new name appears everywhere at once.');
  await expect(dialog.getByRole('textbox', { name: 'Name' })).toBeFocused();
  for (let step = 0; step < 3; step++) await page.keyboard.press('Tab');
  await expect(dialog.getByRole('textbox', { name: 'Name' })).toBeFocused();
  await audit(page);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('overlays render in their provider, escape clipping and follow its theme', async ({
  page,
}) => {
  await story(page, 'testing-browser--portals-harness');
  await page.getByRole('button', { name: 'Nested menu' }).click();
  const menu = page.getByRole('menu', { name: 'Nested menu' });
  await expect(menu).toBeVisible();
  // The nested provider's host lives in the root host, outside the scrolling surface.
  const host = menu.locator('xpath=ancestor::*[contains(@class, "carved-portal-host")][1]');
  await expect(host).toHaveAttribute('data-carved-theme', 'furor');
  await expect(
    host.locator('xpath=ancestor::*[contains(@class, "carved-portal-host")]'),
  ).toHaveCount(1);
  await expect(menu.getByRole('menuitem', { name: 'Second action' })).toBeInViewport();
  const accent = () =>
    menu.evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--carved-accent').trim(),
    );
  expect(await accent()).toBe('#fde68a');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Change accent' }).click();
  await page.getByRole('button', { name: 'Nested menu' }).click();
  await expect.poll(accent).toBe('#a5f3fc');
});

test('touch cuts deeper: hover and press grow the shadow', async ({ page }) => {
  await story(page, 'actions-button--variants');
  const button = page.getByRole('button', { name: 'Secondary' });
  const offset = () =>
    button.evaluate((element) =>
      Number(getComputedStyle(element).boxShadow.match(/(-?[\d.]+)px (-?[\d.]+)px/)?.[2]),
    );
  const rest = await offset();
  await button.hover();
  await expect.poll(offset).toBeGreaterThan(rest);
  const hovered = await offset();
  await page.mouse.down();
  await expect.poll(offset).toBeGreaterThan(hovered);
  await page.mouse.up();
});

test('mobile: no horizontal scrolling, dialogs fit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await story(page, 'start-showcase--overview');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await story(page, 'testing-browser--portals-harness');
  await page.getByRole('button', { name: 'Rename project' }).click();
  const box = await page.getByRole('dialog').boundingBox();
  expect(box!.width).toBeLessThanOrEqual(390 - 16);
});

test('reduced motion stops the spinner but keeps its label', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await story(page, 'feedback-alert--progress');
  const spinner = page.getByRole('progressbar', { name: 'Loading projects' });
  await expect(spinner).toBeVisible();
  expect(
    await spinner.evaluate((element) => getComputedStyle(element).animationIterationCount),
  ).toBe('1');
});

test('forced colors keep controls visible and focus drawn', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit does not emulate forced colors.');
  await page.emulateMedia({ forcedColors: 'active' });
  await story(page, 'testing-browser--controls-harness');
  await page.getByRole('textbox', { name: 'Email' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('checkbox', { name: 'Project updates' })).toBeFocused();
  const box = page.locator('.carved-checkbox-box').first();
  expect(await box.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('solid');
  expect(await box.evaluate((element) => getComputedStyle(element).borderStyle)).toBe('solid');
  // Emulation sets the media query without the system palette, so contrast is not meaningful.
  await audit(page, { contrast: false });
});

test('an avatar whose image fails shows its initials', async ({ page }) => {
  await story(page, 'content-card--badges-and-avatars');
  await expect(page.getByRole('img', { name: 'Broken Image' })).toHaveText('BI');
  await expect(page.getByRole('img', { name: 'Broken Image' }).locator('img')).toHaveCount(0);
});

test.describe('visual', { tag: '@visual' }, () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Baselines use Chromium.');
  for (const theme of ['ponton', 'light', 'furor'])
    test(`showcase in ${theme}`, async ({ page }) => {
      await story(page, 'start-showcase--overview', { theme });
      await page.getByRole('radio', { name: theme, exact: true }).click();
      await page.evaluate(() => document.fonts.ready);
      await page.mouse.move(0, 0);
      await expect(page.locator('.showcase')).toHaveScreenshot(`showcase-${theme}.png`);
    });
  test('showcase on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, 'start-showcase--overview');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.showcase')).toHaveScreenshot('showcase-mobile.png');
  });
});
