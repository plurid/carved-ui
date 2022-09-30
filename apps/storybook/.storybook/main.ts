import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import type { ViteDevServer } from 'vite';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.tsx', '../stories/**/*.mdx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      // Prebundle all adapters before Vitest starts; late optimization reloads running tests.
      optimizeDeps: {
        include: [
          'react-aria-components',
          ...[
            'Button',
            'Link',
            'Form',
            'TextField',
            'Checkbox',
            'RadioGroup',
            'Switch',
            'Slider',
            'Select',
            'ComboBox',
            'ListBox',
            'Menu',
            'Separator',
            'Dialog',
            'Modal',
            'Popover',
            'Tooltip',
            'Tabs',
            'Disclosure',
            'DisclosureGroup',
            'Breadcrumbs',
            'ProgressBar',
            'Toast',
            'Text',
          ].map((name) => `react-aria-components/${name}`),
        ],
      },
      resolve: {
        alias: [
          {
            find: '@plurid/carved-ui-react/styles.css',
            replacement: `${root}packages/react/src/styles.css`,
          },
          { find: /^@plurid\/carved-ui-react$/, replacement: `${root}packages/react/src/index.ts` },
          { find: /^@plurid\/carved-ui-core$/, replacement: `${root}packages/core/src/index.ts` },
        ],
      },
      plugins: [
        {
          name: 'carved-token-watch',
          configureServer(server: ViteDevServer) {
            const sources = [
              `${root}packages/core/tokens/tokens.json`,
              `${root}packages/core/src/theme.ts`,
            ];
            server.watcher.add(sources);
            let rebuilding = false;
            let queued = false;
            const rebuild = () => {
              rebuilding = true;
              execFile(
                'pnpm',
                ['--filter', '@plurid/carved-ui-core', 'build'],
                { cwd: root },
                (error) => {
                  rebuilding = false;
                  if (error) server.config.logger.error(error.message);
                  else server.ws.send({ type: 'full-reload' });
                  if (queued) {
                    queued = false;
                    rebuild();
                  }
                },
              );
            };
            server.watcher.on('change', (path: string) => {
              if (!sources.includes(path)) return;
              if (rebuilding) queued = true;
              else rebuild();
            });
          },
        },
      ],
    });
  },
};
export default config;
