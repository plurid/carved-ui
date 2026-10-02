import type { Preview } from '@storybook/react-vite';
import { CarvedProvider } from '@plurid/carved-ui-react';
import { presetNames } from '@plurid/carved-ui-core';
import type { ThemePreset } from '@plurid/carved-ui-core';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@plurid/carved-ui-react/styles.css';
import './laboratory.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Carved theme',
      toolbar: { title: 'Theme', icon: 'paintbrush', items: [...presetNames], dynamicTitle: true },
    },
    locale: {
      description: 'Locale and text direction',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en-US', title: 'English (left to right)' },
          { value: 'ar-EG', title: 'Arabic (right to left)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'ponton', locale: 'en-US' },
  decorators: [
    (Story, { globals, parameters }) => (
      <CarvedProvider
        theme={globals.theme as ThemePreset}
        locale={globals.locale as string}
        className="laboratory"
        data-layout={parameters.layout === 'fullscreen' ? 'fullscreen' : 'padded'}
      >
        <Story />
      </CarvedProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    // Scan the whole document: overlays render inside the provider, beside the story.
    // React Aria's live announcer is excluded; its nodes outlive the story that made them.
    a11y: { test: 'error', context: { include: 'body', exclude: '[data-live-announcer]' } },
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Start',
          'Material',
          'Actions',
          'Fields',
          'Choice',
          'Collections',
          'Overlays',
          'Navigation',
          'Feedback',
          'Content',
          'Recipes',
          'Testing',
        ],
      },
    },
  },
};
export default preview;
