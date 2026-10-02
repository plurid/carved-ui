import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  plugins: [storybookTest({ configDir: fileURLToPath(new URL('./.storybook', import.meta.url)) })],
  // Tests build with NODE_ENV=test, where React Aria stops virtualizing unless this is set and
  // otherwise reads it from a `process` the browser does not have.
  define: { 'process.env.VIRT_ON': JSON.stringify('true') },
  test: {
    name: 'stories',
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});
