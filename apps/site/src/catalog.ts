import type { ComponentType } from 'react';
import * as alert from './examples/alert.tsx?example';
import * as alertDialog from './examples/alert-dialog.tsx?example';
import * as badgeAvatar from './examples/badge-avatar.tsx?example';
import * as breadcrumbs from './examples/breadcrumbs.tsx?example';
import * as buttonPending from './examples/button-pending.tsx?example';
import * as buttonSizes from './examples/button-sizes.tsx?example';
import * as buttonVariants from './examples/button-variants.tsx?example';
import * as card from './examples/card.tsx?example';
import * as checkbox from './examples/checkbox.tsx?example';
import * as comboBox from './examples/combo-box.tsx?example';
import * as dialog from './examples/dialog.tsx?example';
import * as disclosure from './examples/disclosure.tsx?example';
import * as drawer from './examples/drawer.tsx?example';
import * as heading from './examples/heading.tsx?example';
import * as link from './examples/link.tsx?example';
import * as menu from './examples/menu.tsx?example';
import * as menuSelection from './examples/menu-selection.tsx?example';
import * as popover from './examples/popover.tsx?example';
import * as progress from './examples/progress.tsx?example';
import * as radio from './examples/radio.tsx?example';
import * as searchField from './examples/search-field.tsx?example';
import * as select from './examples/select.tsx?example';
import * as selectSections from './examples/select-sections.tsx?example';
import * as slider from './examples/slider.tsx?example';
import * as surface from './examples/surface.tsx?example';
import * as switches from './examples/switch.tsx?example';
import * as table from './examples/table.tsx?example';
import * as tabs from './examples/tabs.tsx?example';
import * as textField from './examples/text-field.tsx?example';
import * as textFieldCustom from './examples/text-field-custom.tsx?example';
import * as textFieldValidation from './examples/text-field-validation.tsx?example';
import * as toast from './examples/toast.tsx?example';
import * as toggle from './examples/toggle.tsx?example';

export interface Example {
  title: string;
  description?: string;
  module: { default: ComponentType; code: string; source: string };
}

export interface Entry {
  slug: string;
  title: string;
  group:
    | 'Foundations'
    | 'Actions'
    | 'Fields'
    | 'Collections'
    | 'Overlays'
    | 'Navigation'
    | 'Feedback'
    | 'Content';
  summary: string;
  /** Components whose own props are listed, in order. */
  components: string[];
  examples: Example[];
}

export const catalog: Entry[] = [
  {
    slug: 'surface',
    title: 'Surface and card',
    group: 'Foundations',
    summary:
      'Recesses cut into the material. Each nested surface is one level deeper and darker, down to five.',
    components: ['Surface', 'Card', 'CarvedProvider'],
    examples: [
      {
        title: 'Nested depth',
        description: 'Depth follows composition; you rarely set it.',
        module: surface,
      },
      {
        title: 'Card',
        description: 'A padded surface with header, content and footer parts.',
        module: card,
      },
    ],
  },
  {
    slug: 'button',
    title: 'Button',
    group: 'Actions',
    summary:
      'Carved pills. Hovering cuts a button deeper, pressing cuts it deepest; primary and danger are inlaid.',
    components: ['Button', 'IconButton'],
    examples: [
      { title: 'Variants', module: buttonVariants },
      {
        title: 'Sizes and icons',
        description: 'Icon-only buttons require a label.',
        module: buttonSizes,
      },
      {
        title: 'Pending',
        description: 'While pending, presses are ignored and the work is announced.',
        module: buttonPending,
      },
    ],
  },
  {
    slug: 'link',
    title: 'Link and toggle',
    group: 'Actions',
    summary: 'Links navigate, as inline text or styled as buttons. Toggle buttons stay pressed.',
    components: ['Link', 'ToggleButton', 'ToggleButtonGroup'],
    examples: [
      { title: 'Links', module: link },
      { title: 'Toggles', module: toggle },
    ],
  },
  {
    slug: 'text-field',
    title: 'Text field',
    group: 'Fields',
    summary:
      'Wells for text. Focus deepens the cut and lights its edge; errors light it in the danger ink.',
    components: ['TextField', 'SearchField', 'TextFieldRoot'],
    examples: [
      { title: 'Text and notes', module: textField },
      {
        title: 'Validation',
        description: 'Errors appear after submitting, and clear as they are fixed.',
        module: textFieldValidation,
      },
      { title: 'Search', module: searchField },
      {
        title: 'Your own layout',
        description: 'Compose the parts inside TextFieldRoot.',
        module: textFieldCustom,
      },
    ],
  },
  {
    slug: 'choice',
    title: 'Checkbox, radio and switch',
    group: 'Fields',
    summary:
      'Sockets that fill with the accent when chosen, and a switch whose knob is the only raised piece.',
    components: ['Checkbox', 'CheckboxGroup', 'RadioGroup', 'Radio', 'Switch'],
    examples: [
      { title: 'Checkboxes', module: checkbox },
      { title: 'Radio group', module: radio },
      { title: 'Switches', module: switches },
    ],
  },
  {
    slug: 'slider',
    title: 'Slider',
    group: 'Fields',
    summary: 'A carved groove with an inlaid fill and raised thumbs. Pass an array for a range.',
    components: ['Slider'],
    examples: [{ title: 'Single value and range', module: slider }],
  },
  {
    slug: 'select',
    title: 'Select and combo box',
    group: 'Collections',
    summary: 'Choose from a list. The list opens as a well one level deeper than its field.',
    components: ['Select', 'ComboBox', 'ListBoxSection'],
    examples: [
      { title: 'Select', module: select },
      { title: 'Sections', module: selectSections },
      { title: 'Combo box', description: 'Filters the list as you type.', module: comboBox },
    ],
  },
  {
    slug: 'menu',
    title: 'Menu',
    group: 'Collections',
    summary: 'Actions and options in a popover, with sections, shortcuts, selection and submenus.',
    components: ['Menu', 'MenuItem', 'MenuSection'],
    examples: [
      { title: 'Actions and a submenu', module: menu },
      { title: 'Selection', module: menuSelection },
    ],
  },
  {
    slug: 'dialog',
    title: 'Dialog',
    group: 'Overlays',
    summary:
      'Dialogs are cut into the dimmed page. They trap focus, and return it when they close.',
    components: ['Modal', 'Drawer', 'Dialog', 'AlertDialog'],
    examples: [
      { title: 'Dialog', module: dialog },
      {
        title: 'Confirmation',
        description: 'Stays open and pending while the action runs.',
        module: alertDialog,
      },
      { title: 'Drawer', module: drawer },
    ],
  },
  {
    slug: 'popover',
    title: 'Popover and tooltip',
    group: 'Overlays',
    summary: 'Wells opened beside their trigger, one level deeper than the surface they open from.',
    components: ['Popover', 'Tooltip'],
    examples: [{ title: 'Popover and tooltip', module: popover }],
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    group: 'Navigation',
    summary: 'A carved channel; the chosen tab is inlaid, and the inlay slides between tabs.',
    components: ['Tab'],
    examples: [{ title: 'Tabs', module: tabs }],
  },
  {
    slug: 'disclosure',
    title: 'Disclosure and accordion',
    group: 'Navigation',
    summary: 'Content that folds under its heading, alone or in a group.',
    components: ['Disclosure', 'Accordion', 'DisclosureHeader'],
    examples: [{ title: 'Accordion', module: disclosure }],
  },
  {
    slug: 'breadcrumbs',
    title: 'Breadcrumbs',
    group: 'Navigation',
    summary:
      'Nested pills: each crumb holds the next, cut one level deeper, so the page you are on sits innermost and deepest.',
    components: ['Breadcrumb'],
    examples: [{ title: 'Breadcrumbs', module: breadcrumbs }],
  },
  {
    slug: 'alert',
    title: 'Alert and toast',
    group: 'Feedback',
    summary: 'Messages marked by their tone’s inlay. Alerts sit in the page; toasts come and go.',
    components: ['Alert', 'ToastRegion'],
    examples: [
      { title: 'Alerts', module: alert },
      { title: 'Toasts', module: toast },
    ],
  },
  {
    slug: 'progress',
    title: 'Progress',
    group: 'Feedback',
    summary: 'Progress fills a carved groove; the spinner turns an inlay in a carved ring.',
    components: ['ProgressBar', 'Spinner'],
    examples: [{ title: 'Progress, spinner and skeleton', module: progress }],
  },
  {
    slug: 'heading',
    title: 'Heading and separator',
    group: 'Content',
    summary:
      'Headings, including engraved display type, and lines or trenches cut between content.',
    components: ['Heading', 'Separator'],
    examples: [{ title: 'Type and dividers', module: heading }],
  },
  {
    slug: 'badge',
    title: 'Badge and avatar',
    group: 'Content',
    summary: 'Short labels inlaid with their tone, and portraits set into round sockets.',
    components: ['Badge', 'Avatar'],
    examples: [{ title: 'Badges and avatars', module: badgeAvatar }],
  },
  {
    slug: 'table',
    title: 'Table',
    group: 'Content',
    summary: 'A native table in its own well. It scrolls sideways when it runs out of room.',
    components: [],
    examples: [{ title: 'Table', module: table }],
  },
];

export const groups = [...new Set(catalog.map((entry) => entry.group))];
