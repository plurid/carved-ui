import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, userEvent, within } from 'storybook/test';
import {
  Select,
  SelectValue,
  Label,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  Combobox,
  Input,
  FieldDescription,
  FieldError,
  MenuTrigger,
  Menu,
  MenuItem,
  MenuSection,
  MenuHeader,
  MenuSeparator,
} from '@plurid/carved-ui-react';
const meta = { title: 'Collections/Selection', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
function SelectionChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
function ProjectSelect() {
  const [key, setKey] = useState<string | number | null>(null);
  return (
    <div className="lab-stack lab-field">
      <Select selectedKey={key} onSelectionChange={setKey}>
        <Label>Workspace</Label>
        <Button variant="secondary">
          <SelectValue />
          <SelectionChevron />
        </Button>
        <Popover>
          <ListBox>
            <ListBoxItem id="design">Design</ListBoxItem>
            <ListBoxItem id="engineering">Engineering</ListBoxItem>
            <ListBoxItem id="archive" isDisabled>
              Archive
            </ListBoxItem>
          </ListBox>
        </Popover>
        <FieldDescription>Select your workspace.</FieldDescription>
        <FieldError />
      </Select>
      <output aria-label="Selected workspace">{key ?? 'None'}</output>
    </div>
  );
}
export const SelectControl: Story = {
  render: () => <ProjectSelect />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Workspace/ });
    trigger.focus();
    await userEvent.keyboard(' ');
    const page = within(canvasElement.ownerDocument.body);
    await expect(await page.findByRole('listbox')).toBeVisible();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(canvas.getByLabelText('Selected workspace')).toHaveTextContent('engineering');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
export const EmptySelect: Story = {
  render: () => (
    <Select className="lab-field">
      <Label>No available workspaces</Label>
      <Button variant="secondary">
        <SelectValue />
      </Button>
      <Popover>
        <ListBox renderEmptyState={() => 'No workspaces available.'} />
      </Popover>
    </Select>
  ),
};
export const DisabledSelect: Story = {
  render: () => (
    <Select isDisabled className="lab-field">
      <Label>Workspace</Label>
      <Button variant="secondary">
        <SelectValue />
      </Button>
      <Popover>
        <ListBox>
          <ListBoxItem id="design">Design</ListBoxItem>
        </ListBox>
      </Popover>
    </Select>
  ),
};
export const ComboboxControl: Story = {
  render: () => (
    <Combobox className="lab-field">
      <Label>Find a project</Label>
      <Input />
      <Button aria-label="Show projects" variant="ghost">
        <SelectionChevron />
      </Button>
      <Popover>
        <ListBox>
          <ListBoxItem id="carved">Carved UI</ListBoxItem>
          <ListBoxItem id="docs">Documentation</ListBoxItem>
          <ListBoxItem id="tokens">Design tokens</ListBoxItem>
        </ListBox>
      </Popover>
    </Combobox>
  ),
};
function ActionMenu() {
  const [action, setAction] = useState('None');
  return (
    <div className="lab-stack">
      <MenuTrigger>
        <Button variant="secondary">Project actions</Button>
        <Popover>
          <Menu onAction={(key) => setAction(String(key))}>
            <MenuSection>
              <MenuHeader>Project</MenuHeader>
              <MenuItem id="rename">Rename project</MenuItem>
              <MenuItem id="duplicate">Duplicate project</MenuItem>
              <MenuItem id="archive" isDisabled>
                Archive project
              </MenuItem>
            </MenuSection>
            <MenuSeparator />
            <MenuItem id="delete">Delete project</MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
      <output aria-label="Last action">{action}</output>
    </div>
  );
}
export const ActionMenuControl: Story = {
  render: () => <ActionMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Project actions' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const page = within(canvasElement.ownerDocument.body);
    await expect(await page.findByRole('menu')).toBeVisible();
    await waitFor(() =>
      expect(page.getByRole('menuitem', { name: 'Rename project' })).toHaveFocus(),
    );
    await userEvent.keyboard('{End}');
    await waitFor(() =>
      expect(page.getByRole('menuitem', { name: 'Delete project' })).toHaveFocus(),
    );
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByLabelText('Last action')).toHaveTextContent('delete');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
