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

test('date picker: the calendar opens, moves and chooses by keyboard', async ({ page }) => {
  await story(page, 'testing-browser--collections-harness');
  await page.getByRole('button', { name: /Calendar/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: /March 10, 2026/ })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Launch', { exact: true })).toHaveText('2026-03-17');
  await expect(page.getByRole('dialog')).toBeHidden();
  await audit(page);
});

test('data table: sorting and selecting', async ({ page }) => {
  await story(page, 'testing-browser--collections-harness');
  const latency = page.getByRole('columnheader', { name: /Latency/ });
  await latency.click();
  await expect(latency).toHaveAttribute('aria-sort', 'ascending');
  await expect(page.getByRole('row').nth(1)).toContainText('Frankfurt');
  await latency.click();
  await expect(page.getByRole('row').nth(1)).toContainText('Virginia');
  // The select-all checkbox sits in the first column's header.
  await page.getByRole('columnheader').first().locator('.carved-checkbox-box').click();
  await expect(page.locator('[role="row"][aria-selected="true"]')).toHaveCount(3);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Space');
  await expect(page.locator('[role="row"][aria-selected="true"]')).toHaveCount(2);
});

test('tree: each open level is a well one depth deeper', async ({ page }) => {
  await story(page, 'testing-browser--collections-harness');
  const fills = await page
    .getByRole('row', { name: 'button.tsx' })
    .locator('.carved-tree-well')
    .evaluateAll((wells) => wells.map((well) => getComputedStyle(well).backgroundColor));
  expect(fills).toHaveLength(2);
  expect(fills[0]).not.toBe(fills[1]);
  await page.getByRole('row', { name: 'components' }).click();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('row', { name: 'button.tsx' })).toHaveCount(0);
});

test('drop zone: dropped files of the accepted type are taken, others refused', async ({
  page,
  browserName,
}) => {
  // React Aria takes a dropped file through its file system entry, and Chromium gives files
  // made by a script none. Real drops have one; Storybook covers choosing files in Chromium.
  test.skip(browserName === 'chromium', 'Chromium gives scripted files no file system entry');
  await story(page, 'testing-browser--collections-harness');
  const zone = page.locator('.carved-drop-zone');
  const transfer = await page.evaluateHandle(() => {
    const data = new DataTransfer();
    data.items.add(new File(['png'], 'photo.png', { type: 'image/png' }));
    data.items.add(new File(['txt'], 'notes.txt', { type: 'text/plain' }));
    return data;
  });
  for (const type of ['dragenter', 'dragover', 'drop'])
    await zone.dispatchEvent(type, { dataTransfer: transfer });
  await expect(page.getByLabel('Dropped files')).toHaveText('photo.png');
});

test('command palette: the shortcut opens it, typing filters, Enter runs', async ({ page }) => {
  await story(page, 'testing-browser--collections-harness');
  // ⌘K on Apple platforms, Ctrl+K elsewhere, by the platform the page reports. Emulated
  // devices report theirs through client hints, so those come first, as in the palette.
  const apple = await page.evaluate(() =>
    /mac|iphone|ipad/i.test(
      (navigator as Navigator & { userAgentData?: { platform: string } }).userAgentData?.platform ??
        navigator.platform,
    ),
  );
  await page.keyboard.press(apple ? 'Meta+k' : 'Control+k');
  const search = page.getByRole('searchbox', { name: 'Search commands' });
  await expect(search).toBeFocused();
  await search.fill('bill');
  await expect(page.getByRole('menuitem')).toHaveCount(1);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Last command')).toHaveText('billing');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('focus is a lit edge for the keyboard, and nothing after a click', async ({ page }) => {
  await story(page, 'testing-browser--controls-harness');
  const save = page.getByRole('button', { name: 'Save', exact: true });
  const edge = () =>
    save.evaluate((button) => {
      const style = getComputedStyle(button);
      return { style: style.outlineStyle, offset: style.outlineOffset };
    });
  await save.click();
  expect((await edge()).style).toBe('none');
  // Safari does not focus a clicked button; focus it, then use the keyboard without moving.
  await save.focus();
  expect((await edge()).style).toBe('none');
  await page.keyboard.press('ArrowRight');
  await expect(save).toBeFocused();
  // Drawn inside the control, following its shape, rather than floating around it.
  expect(await edge()).toEqual({ style: 'solid', offset: '-2px' });
});

test('links run along an engraved groove that deepens when touched', async ({ page }) => {
  await story(page, 'actions-button--links');
  const link = page.locator('.carved-link').first();
  const groove = () => link.evaluate((element) => getComputedStyle(element).backgroundSize);
  expect(await link.evaluate((element) => getComputedStyle(element).textDecorationLine)).toBe(
    'none',
  );
  expect(await groove()).toBe('100% 1px, 100% 1px');
  await link.hover();
  await expect.poll(groove).toBe('100% 2px, 100% 1px');
});

test('a slider thumb stays inside its carved slot and lands under the pointer', async ({
  page,
}) => {
  await story(page, 'testing-browser--controls-harness');
  const input = page.getByRole('slider', { name: 'Volume' });
  const slider = page.locator('.carved-slider').filter({ has: input });
  const track = slider.locator('.carved-slider-track');
  const thumb = slider.locator('.carved-slider-thumb');
  const expectInside = async () => {
    const [slot, rail, knob] = await Promise.all([
      slider.boundingBox(),
      track.boundingBox(),
      thumb.boundingBox(),
    ]);
    // The slot spans the slider's width and the rail's height.
    expect(knob!.x).toBeGreaterThan(slot!.x);
    expect(knob!.x + knob!.width).toBeLessThan(slot!.x + slot!.width);
    expect(knob!.y).toBeGreaterThan(rail!.y);
    expect(knob!.y + knob!.height).toBeLessThan(rail!.y + rail!.height);
  };
  await input.focus();
  await page.keyboard.press('Home');
  await expect(input).toHaveValue('0');
  await expectInside();
  await page.keyboard.press('End');
  await expect(input).toHaveValue('100');
  await expectInside();
  // The pointer maps onto the rail the thumb travels: a quarter along it is a quarter.
  const rail = (await track.boundingBox())!;
  await page.mouse.click(rail.x + rail.width / 4, rail.y + rail.height / 2);
  await expect(input).toHaveValue('25');
});

test('every control shows the cursor for what it does', async ({ page }) => {
  await story(page, 'testing-browser--controls-harness');
  const cursor = (locator: ReturnType<Page['locator']>) =>
    locator.evaluate((element) => getComputedStyle(element).cursor);
  expect(await cursor(page.getByRole('button', { name: 'Save', exact: true }))).toBe('pointer');
  expect(await cursor(page.getByRole('textbox', { name: 'Email' }))).toBe('text');
  expect(await cursor(page.locator('.carved-slider-thumb').first())).toBe('grab');
  expect(await cursor(page.locator('.carved-slider-track').first())).toBe('pointer');
  // Disabled wins over every resting cursor.
  expect(await cursor(page.getByRole('button', { name: 'Unavailable' }))).toBe('not-allowed');
});

test('a progress bar at 1% shows a whole bead in its slot', async ({ page }) => {
  await story(page, 'feedback-alert--progress');
  const fill = page.getByRole('progressbar', { name: 'Starting' }).locator('.carved-progress-fill');
  const box = (await fill.boundingBox())!;
  // The bead is never narrower than it is tall, so a small value reads as a round inlay.
  expect(box.width).toBeGreaterThanOrEqual(box.height - 0.5);
  expect(box.height).toBeGreaterThan(18);
  await expect(
    page.getByRole('progressbar', { name: 'Queued' }).locator('.carved-progress-fill'),
  ).toHaveCSS('inline-size', '0px');
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

test('a virtualized table renders only the rows in view, and reaches the last', async ({
  page,
}) => {
  await story(page, 'collections-virtualizer--table');
  const table = page.getByRole('grid', { name: 'People' });
  await expect(table).toHaveAttribute('aria-rowcount', '1001');
  expect(await table.getByRole('row').count()).toBeLessThan(30);
  // Rows are one box each: filled and ruled whole, and never wider than the table.
  const row = table.getByRole('row').nth(1);
  expect(await row.evaluate((element) => getComputedStyle(element).borderBottomWidth)).toBe('1px');
  expect(await table.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await table.evaluate((element) => element.scrollTo(0, element.scrollHeight));
  await expect(table.getByRole('rowheader', { name: '1000', exact: true })).toBeVisible();
  // The header stays in place while the rows scroll beneath it.
  const header = table.getByRole('columnheader', { name: /Number/ });
  const box = await header.boundingBox();
  const frame = await table.boundingBox();
  expect(Math.abs(box!.y - frame!.y)).toBeLessThan(4);
});

test('a split view resizes by dragging its handle, both ways round', async ({ page }) => {
  // Stories run their own interactions first, so each starts away from its default size.
  for (const [id, direction, initial] of [
    ['layout-shell-and-split-view--side-by-side', 1, 30],
    ['layout-shell-and-split-view--right-to-left', -1, 40],
  ] as const) {
    await story(page, id);
    const handle = page.getByRole('separator');
    const box = (await handle.boundingBox())!;
    // Big enough to grab: WCAG 2.2 asks for 24 pixels.
    expect(box.width).toBeGreaterThanOrEqual(24);
    const before = Number(await handle.getAttribute('aria-valuenow'));
    // Dragging towards the first pane, which is on the right in right-to-left text, shrinks it.
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 120 * direction, box.y + box.height / 2, {
      steps: 6,
    });
    await page.mouse.up();
    await expect
      .poll(async () => Number(await handle.getAttribute('aria-valuenow')))
      .toBeLessThan(before - 5);
    // A double click returns to the default.
    await handle.dblclick();
    await expect(handle).toHaveAttribute('aria-valuenow', String(initial));
  }
});

test('an app shell collapses by its own width, not the window’s', async ({ page }) => {
  await story(page, 'layout-shell-and-split-view--narrow-shell');
  expect(page.viewportSize()!.width).toBeGreaterThan(1000);
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Mailboxes' })).toBeHidden();
  await story(page, 'layout-shell-and-split-view--wide-shell');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Mailboxes' })).toBeVisible();
});
