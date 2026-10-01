import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default defineConfig(
  globalIgnores([
    '**/dist/',
    '**/.next/',
    '**/node_modules/',
    '**/test-results/',
    '**/playwright-report/',
    'tools/vite/generated/',
    'legacy/',
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  {
    files: ['**/*.{ts,tsx}'],
    rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
  {
    files: ['**/*.tsx'],
    extends: [hooks.configs.flat['recommended-latest']],
  },
  {
    // Stories define render functions inline; Storybook calls them as components.
    files: ['apps/storybook/stories/**/*.tsx'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
);
