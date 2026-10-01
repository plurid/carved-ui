import { defineConfig } from 'vitest/config';
import { carved } from '../vite/carved.ts';

// Unit and server-rendering tests run against package source, like Storybook does.
export default defineConfig({
  plugins: [carved()],
  test: {
    environment: 'node',
    root: new URL('../../', import.meta.url).pathname,
    include: ['packages/**/*.test.ts', 'tools/tests/*.test.ts'],
  },
});
