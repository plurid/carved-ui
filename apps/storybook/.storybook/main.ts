import type { StorybookConfig } from '@storybook/react-vite';
import { carved } from '../../../tools/vite/carved.ts';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, { plugins: [carved()] });
  },
};
export default config;
