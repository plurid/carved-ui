import type { Preview } from '@storybook/react-vite';
import { CarvedProvider } from '@plurid/carved-ui-react';
import { presetNames } from '@plurid/carved-ui-core';
import type { ThemePreset } from '@plurid/carved-ui-core';
import '@plurid/carved-ui-react/styles.css';
import './laboratory.css';
// Playwright runs its own axe scans. Avoid two scanners running in the same frame.
const browserSuite =
  typeof window !== 'undefined' &&
  new URL(window.location.href).searchParams.has('carved-browser-test');
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Carved theme',
      toolbar: { icon: 'paintbrush', items: [...presetNames] },
    },
    direction: { description: 'Text direction', toolbar: { icon: 'globe', items: ['ltr', 'rtl'] } },
  },
  initialGlobals: { theme: 'ponton', direction: 'ltr' },
  decorators: [
    (Story, context) => (
      <CarvedProvider
        theme={context.globals.theme as ThemePreset}
        dir={context.globals.direction as 'ltr' | 'rtl'}
        locale={context.globals.direction === 'rtl' ? 'ar' : 'en-US'}
      >
        <main className="laboratory">
          <Story />
        </main>
      </CarvedProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: browserSuite ? 'off' : 'error',
      context: '#storybook-root, [data-overlay-container]',
    },
    controls: { expanded: true },
  },
};
export default preview;
