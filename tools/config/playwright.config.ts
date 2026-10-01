import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const viewport = { width: 1440, height: 1000 };

// Browser tests run against the built Storybook and documentation site. Baselines are per platform, as font
// rendering differs between operating systems.
export default defineConfig({
  testDir: '../tests',
  testMatch: ['browser.spec.ts', 'site.spec.ts'],
  outputDir: `${root}tools/tests/test-results`,
  snapshotPathTemplate: '{testDir}/snapshots/{platform}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['html', { outputFolder: `${root}tools/tests/playwright-report`, open: 'never' }]]
    : 'list',
  expect: { timeout: 5000, toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled' } },
  use: {
    baseURL: 'http://127.0.0.1:6016',
    locale: 'en-US',
    timezoneId: 'UTC',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport } },
  ],
  webServer: [
    {
      command: 'node tools/build/serve.mjs apps/storybook/dist 6016',
      cwd: root,
      url: 'http://127.0.0.1:6016',
      timeout: 60000,
    },
    {
      command: 'node tools/build/serve.mjs apps/site/dist 6020',
      cwd: root,
      url: 'http://127.0.0.1:6020',
      timeout: 60000,
    },
  ],
});
