/** A demo on a component's page. Its module loads with the page, not with the site. */
export interface Example {
  title: string;
  description?: string;
  /** The file in `src/examples`, without its extension. */
  file: string;
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
        file: 'surface',
      },
      {
        title: 'Card',
        description: 'A padded surface with header, content and footer parts.',
        file: 'card',
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
      { title: 'Variants', file: 'button-variants' },
      {
        title: 'Sizes and icons',
        description: 'Icon-only buttons require a label.',
        file: 'button-sizes',
      },
      {
        title: 'Pending',
        description: 'While pending, presses are ignored and the work is announced.',
        file: 'button-pending',
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
      { title: 'Links', file: 'link' },
      { title: 'Toggles', file: 'toggle' },
    ],
  },
  {
    slug: 'toolbar',
    title: 'Toolbar',
    group: 'Actions',
    summary:
      'A channel of related controls. It is a single Tab stop, and arrow keys move between its controls.',
    components: ['Toolbar'],
    examples: [{ title: 'Formatting', file: 'toolbar' }],
  },
  {
    slug: 'text-field',
    title: 'Text field',
    group: 'Fields',
    summary:
      'Wells for text. Focus deepens the cut and lights its edge; errors light it in the danger ink.',
    components: ['TextField', 'SearchField', 'TextFieldRoot'],
    examples: [
      { title: 'Text and notes', file: 'text-field' },
      {
        title: 'Validation',
        description: 'Errors appear after submitting, and clear as they are fixed.',
        file: 'text-field-validation',
      },
      { title: 'Search', file: 'search-field' },
      {
        title: 'Your own layout',
        description: 'Compose the parts inside TextFieldRoot.',
        file: 'text-field-custom',
      },
    ],
  },
  {
    slug: 'number-field',
    title: 'Number field',
    group: 'Fields',
    summary:
      'Numbers formatted for the locale, as plain values, percentages, currencies or units, with steppers in the well.',
    components: ['NumberField'],
    examples: [{ title: 'Counts, percentages and currency', file: 'number-field' }],
  },
  {
    slug: 'date',
    title: 'Date and time',
    group: 'Fields',
    summary:
      'Dates and times typed segment by segment, in the order and clock of the locale; pickers open a calendar beside the field.',
    components: ['DatePicker', 'DateRangePicker', 'DateField', 'TimeField'],
    examples: [
      {
        title: 'Pickers',
        description: 'Limits and unavailable days are announced and refused.',
        file: 'date-picker',
      },
      { title: 'Fields', file: 'date-field' },
    ],
  },
  {
    slug: 'calendar',
    title: 'Calendar',
    group: 'Fields',
    summary:
      'Days in round sockets: hovering cuts one, the chosen day is inlaid, today is marked, and a range cuts a band between its ends.',
    components: ['Calendar', 'RangeCalendar'],
    examples: [{ title: 'A day and a range', file: 'calendar' }],
  },
  {
    slug: 'choice',
    title: 'Checkbox, radio and switch',
    group: 'Fields',
    summary:
      'Sockets that fill with the accent when chosen, and a switch whose knob is the only raised piece.',
    components: ['Checkbox', 'CheckboxGroup', 'RadioGroup', 'Radio', 'Switch'],
    examples: [
      { title: 'Checkboxes', file: 'checkbox' },
      { title: 'Radio group', file: 'radio' },
      { title: 'Switches', file: 'switch' },
    ],
  },
  {
    slug: 'slider',
    title: 'Slider',
    group: 'Fields',
    summary: 'A carved groove with an inlaid fill and raised thumbs. Pass an array for a range.',
    components: ['Slider'],
    examples: [{ title: 'Single value and range', file: 'slider' }],
  },
  {
    slug: 'color',
    title: 'Colour',
    group: 'Fields',
    summary:
      'A swatch that opens an editor, or its parts alone: an area, sliders and a wheel carved over their colours, with raised thumbs.',
    components: [
      'ColorPicker',
      'ColorArea',
      'ColorSlider',
      'ColorWheel',
      'ColorField',
      'ColorSwatchPicker',
      'ColorSwatch',
    ],
    examples: [
      { title: 'Picker', file: 'color-picker' },
      { title: 'Parts', description: 'Every part edits the same colour.', file: 'color-parts' },
    ],
  },
  {
    slug: 'drop-zone',
    title: 'Drop zone',
    group: 'Fields',
    summary:
      'A well that takes files dropped, pasted or chosen. It cuts deeper and lights its edge while files hover over it.',
    components: ['DropZone'],
    examples: [{ title: 'Images', file: 'drop-zone' }],
  },
  {
    slug: 'fieldset',
    title: 'Fieldset',
    group: 'Fields',
    summary: 'A named group of related fields, such as an address.',
    components: ['Fieldset'],
    examples: [{ title: 'Address', file: 'fieldset' }],
  },
  {
    slug: 'select',
    title: 'Select and combo box',
    group: 'Collections',
    summary: 'Choose from a list. The list opens as a well one level deeper than its field.',
    components: ['Select', 'ComboBox', 'ListBoxSection'],
    examples: [
      { title: 'Select', file: 'select' },
      { title: 'Sections', file: 'select-sections' },
      { title: 'Combo box', description: 'Filters the list as you type.', file: 'combo-box' },
    ],
  },
  {
    slug: 'menu',
    title: 'Menu',
    group: 'Collections',
    summary: 'Actions and options in a popover, with sections, shortcuts, selection and submenus.',
    components: ['Menu', 'MenuItem', 'MenuSection'],
    examples: [
      { title: 'Actions and a submenu', file: 'menu' },
      { title: 'Selection', file: 'menu-selection' },
    ],
  },
  {
    slug: 'data-table',
    title: 'Data table',
    group: 'Collections',
    summary:
      'A table in its own well whose rows sort, select and move with the arrow keys, and whose columns resize.',
    components: ['DataTable', 'Column', 'DataTableBody', 'Row'],
    examples: [
      {
        title: 'Sorting and selection',
        description: 'Sorting is yours: the table reports the column and direction to sort by.',
        file: 'data-table',
      },
      {
        title: 'Resizing and loading',
        description: 'Drag a column’s groove, or focus it and use the arrow keys.',
        file: 'data-table-resize',
      },
    ],
  },
  {
    slug: 'grid-list',
    title: 'Grid list',
    group: 'Collections',
    summary:
      'An interactive list whose items can hold buttons and links. Arrow keys move between items; Tab moves into them.',
    components: ['GridList', 'GridListItem'],
    examples: [{ title: 'Members', file: 'grid-list' }],
  },
  {
    slug: 'tree',
    title: 'Tree',
    group: 'Collections',
    summary: 'Nested items that open and close, such as files in folders.',
    components: ['Tree', 'TreeItem'],
    examples: [{ title: 'Files', file: 'tree' }],
  },
  {
    slug: 'tag-group',
    title: 'Tag group',
    group: 'Collections',
    summary: 'Small carved pills, removable or selectable like toggles.',
    components: ['TagGroup', 'Tag'],
    examples: [{ title: 'Removable and selectable', file: 'tag-group' }],
  },
  {
    slug: 'dialog',
    title: 'Dialog',
    group: 'Overlays',
    summary:
      'Dialogs are cut into the dimmed page. They trap focus, and return it when they close.',
    components: ['Modal', 'Drawer', 'Dialog', 'AlertDialog'],
    examples: [
      { title: 'Dialog', file: 'dialog' },
      {
        title: 'Confirmation',
        description: 'Stays open and pending while the action runs.',
        file: 'alert-dialog',
      },
      { title: 'Drawer', file: 'drawer' },
    ],
  },
  {
    slug: 'popover',
    title: 'Popover and tooltip',
    group: 'Overlays',
    summary: 'Wells opened beside their trigger, one level deeper than the surface they open from.',
    components: ['Popover', 'Tooltip'],
    examples: [{ title: 'Popover and tooltip', file: 'popover' }],
  },
  {
    slug: 'command-palette',
    title: 'Command palette',
    group: 'Overlays',
    summary:
      'Every command one search away: a dialog cut near the top of the page that opens with ⌘K or Ctrl+K.',
    components: ['CommandPalette', 'CommandItem'],
    examples: [{ title: 'Commands', file: 'command-palette' }],
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    group: 'Navigation',
    summary: 'A carved channel; the chosen tab is inlaid, and the inlay slides between tabs.',
    components: ['Tab'],
    examples: [{ title: 'Tabs', file: 'tabs' }],
  },
  {
    slug: 'disclosure',
    title: 'Disclosure and accordion',
    group: 'Navigation',
    summary: 'Content that folds under its heading, alone or in a group.',
    components: ['Disclosure', 'Accordion', 'DisclosureHeader'],
    examples: [{ title: 'Accordion', file: 'disclosure' }],
  },
  {
    slug: 'breadcrumbs',
    title: 'Breadcrumbs',
    group: 'Navigation',
    summary:
      'Nested pills: each crumb holds the next, cut one level deeper, so the page you are on sits innermost and deepest.',
    components: ['Breadcrumb'],
    examples: [{ title: 'Breadcrumbs', file: 'breadcrumbs' }],
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    group: 'Navigation',
    summary:
      'Pages of a long list in a carved channel, the current page inlaid. Pages are buttons, or links for lists rendered on the server.',
    components: ['Pagination'],
    examples: [{ title: 'Buttons and links', file: 'pagination' }],
  },
  {
    slug: 'alert',
    title: 'Alert and toast',
    group: 'Feedback',
    summary: 'Messages marked by their tone’s inlay. Alerts sit in the page; toasts come and go.',
    components: ['Alert', 'ToastRegion'],
    examples: [
      { title: 'Alerts', file: 'alert' },
      { title: 'Toasts', file: 'toast' },
    ],
  },
  {
    slug: 'progress',
    title: 'Progress',
    group: 'Feedback',
    summary: 'Progress fills a carved groove; the spinner turns an inlay in a carved ring.',
    components: ['ProgressBar', 'Spinner'],
    examples: [{ title: 'Progress, spinner and skeleton', file: 'progress' }],
  },
  {
    slug: 'meter',
    title: 'Meter',
    group: 'Feedback',
    summary:
      'An amount within a known range, such as storage used, inlaid with a tone that can warn as it fills.',
    components: ['Meter'],
    examples: [{ title: 'Meters', file: 'meter' }],
  },
  {
    slug: 'heading',
    title: 'Heading and separator',
    group: 'Content',
    summary:
      'Headings, including engraved display type, and lines or trenches cut between content.',
    components: ['Heading', 'Separator'],
    examples: [{ title: 'Type and dividers', file: 'heading' }],
  },
  {
    slug: 'badge',
    title: 'Badge and avatar',
    group: 'Content',
    summary: 'Short labels inlaid with their tone, and portraits set into round sockets.',
    components: ['Badge', 'Avatar', 'AvatarGroup'],
    examples: [
      { title: 'Badges and avatars', file: 'badge-avatar' },
      { title: 'Avatar group', file: 'avatar-group' },
    ],
  },
  {
    slug: 'table',
    title: 'Table',
    group: 'Content',
    summary:
      'A native table in its own well, rendered on the server. For sorting and selection, use the data table.',
    components: [],
    examples: [{ title: 'Table', file: 'table' }],
  },
  {
    slug: 'kbd',
    title: 'Keyboard key',
    group: 'Content',
    summary: 'Keys and shortcuts on raised keycaps: keys are pieces that move.',
    components: ['Kbd'],
    examples: [{ title: 'Shortcuts', file: 'kbd' }],
  },
];

export const groups = [...new Set(catalog.map((entry) => entry.group))];
