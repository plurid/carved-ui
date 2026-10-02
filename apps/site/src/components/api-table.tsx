import api from 'virtual:carved-api';
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@plurid/carved-ui-react';

// What each component builds on, for the props it does not document itself.
const reactAria: Record<string, string> = {
  Button: 'Button',
  IconButton: 'Button',
  Link: 'Link',
  ToggleButton: 'ToggleButton',
  ToggleButtonGroup: 'ToggleButtonGroup',
  TextField: 'TextField',
  TextFieldRoot: 'TextField',
  SearchField: 'SearchField',
  Checkbox: 'Checkbox',
  CheckboxGroup: 'CheckboxGroup',
  RadioGroup: 'RadioGroup',
  Radio: 'RadioGroup',
  Switch: 'Switch',
  Slider: 'Slider',
  Select: 'Select',
  ComboBox: 'ComboBox',
  ListBoxSection: 'ListBox',
  Menu: 'Menu',
  MenuItem: 'Menu',
  MenuSection: 'Menu',
  Modal: 'Modal',
  Drawer: 'Modal',
  Dialog: 'Dialog',
  AlertDialog: 'Dialog',
  Popover: 'Popover',
  Tooltip: 'Tooltip',
  Tab: 'Tabs',
  Disclosure: 'Disclosure',
  DisclosureHeader: 'Disclosure',
  Accordion: 'DisclosureGroup',
  Breadcrumb: 'Breadcrumbs',
  ProgressBar: 'ProgressBar',
  Spinner: 'ProgressBar',
  ToastRegion: 'Toast',
  Meter: 'Meter',
  NumberField: 'NumberField',
  DateField: 'DateField',
  TimeField: 'TimeField',
  DatePicker: 'DatePicker',
  DateRangePicker: 'DateRangePicker',
  Calendar: 'Calendar',
  RangeCalendar: 'RangeCalendar',
  ColorPicker: 'ColorPicker',
  ColorArea: 'ColorArea',
  ColorSlider: 'ColorSlider',
  ColorWheel: 'ColorWheel',
  ColorField: 'ColorField',
  ColorSwatch: 'ColorSwatch',
  ColorSwatchPicker: 'ColorSwatchPicker',
  ColorSwatchPickerItem: 'ColorSwatchPicker',
  DropZone: 'DropZone',
  FileTrigger: 'FileTrigger',
  DataTable: 'Table',
  DataTableHeader: 'Table',
  DataTableBody: 'Table',
  Column: 'Table',
  Row: 'Table',
  Cell: 'Table',
  GridList: 'GridList',
  GridListItem: 'GridList',
  Tree: 'Tree',
  TreeItem: 'Tree',
  TagGroup: 'TagGroup',
  Tag: 'TagGroup',
  Toolbar: 'Toolbar',
  CommandPalette: 'Menu',
  CommandItem: 'Menu',
  Tabs: 'Tabs',
  Autocomplete: 'Autocomplete',
  Virtualizer: 'Virtualizer',
  SidebarItem: 'Link',
  TabList: 'Tabs',
  TabPanel: 'Tabs',
};
const native: Record<string, string> = {
  Surface: 'div',
  Card: 'div',
  CarvedProvider: 'div',
  Alert: 'div',
  Heading: 'h1–h6',
  Separator: 'hr',
  Badge: 'span',
  Avatar: 'span',
  AvatarGroup: 'div',
  Kbd: 'kbd',
  Fieldset: 'fieldset',
  FileList: 'ul',
  FileItem: 'li',
  Pagination: 'nav',
  SplitView: 'div',
  SplitPane: 'div',
  AppShell: 'div',
  Sidebar: 'nav',
  SidebarSection: 'section',
};

/** Show `code` in documentation comments as code. */
function Doc({ text }: { text: string }) {
  return text.split('`').map((part, index) => (index % 2 ? <code key={index}>{part}</code> : part));
}

export function ApiTable({ name }: { name: string }) {
  const component = api[name];
  if (!component) return null;
  const base = reactAria[name];
  return (
    <section className="api" aria-labelledby={`api-${name}`}>
      <h3 id={`api-${name}`} className="api-name">
        <code>{`<${name}>`}</code>
      </h3>
      {component.description && (
        <p className="api-description">
          <Doc text={component.description} />
        </p>
      )}
      {component.props.length > 0 && (
        <Table aria-labelledby={`api-${name}`}>
          <TableHead>
            <TableRow>
              <TableHeader>Prop</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Default</TableHeader>
              <TableHeader>Description</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {component.props.map((prop) => (
              <TableRow key={prop.name}>
                <TableHeader scope="row">
                  <code>{prop.name}</code>
                  {prop.required && <span className="api-required"> required</span>}
                </TableHeader>
                <TableCell>
                  <code className="api-type">{prop.type}</code>
                </TableCell>
                <TableCell>{prop.defaultValue ? <code>{prop.defaultValue}</code> : '—'}</TableCell>
                <TableCell>
                  <Doc text={prop.description} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <p className="api-inherits">
        {base ? (
          <>
            Also accepts every prop of React Aria’s{' '}
            <Link
              href={`https://react-spectrum.adobe.com/react-aria/${base}.html`}
              target="_blank"
              rel="noreferrer"
            >
              {base}
            </Link>
            .
          </>
        ) : native[name] ? (
          <>
            Also accepts the attributes of a native <code>{native[name]}</code> element.
          </>
        ) : null}
      </p>
    </section>
  );
}
