import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  ComboBox,
  ComboBoxItem,
  Form,
  type Key,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectItem,
  SelectRoot,
  SelectSection,
  SelectValue,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Collections/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="lab-narrow lab-tall">{Story()}</div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

const workspaces = [
  { id: 'design', name: 'Design' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'research', name: 'Research' },
  { id: 'archive', name: 'Archive' },
];

export const Default: Story = {
  args: { children: null },
  render: () => {
    const [value, setValue] = useState<Key | null>(null);
    return (
      <div className="lab-stack">
        <Select
          label="Workspace"
          placeholder="Choose a workspace"
          items={workspaces}
          value={value}
          onChange={setValue}
        >
          {(item) => <SelectItem>{item.name}</SelectItem>}
        </Select>
        <output aria-label="Selected workspace">{value}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Workspace/ });
    trigger.focus();
    await userEvent.keyboard(' ');
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(canvas.getByLabelText('Selected workspace')).toHaveTextContent('engineering');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Sections: Story = {
  args: { children: null },
  render: () => (
    <Select label="Region" placeholder="Choose a region" description="Data stays in this region.">
      <SelectSection title="Europe">
        <SelectItem id="fra">Frankfurt</SelectItem>
        <SelectItem id="ams">Amsterdam</SelectItem>
      </SelectSection>
      <SelectSection title="Americas">
        <SelectItem id="iad">Virginia</SelectItem>
        <SelectItem id="gru">São Paulo</SelectItem>
        <SelectItem id="yul" isDisabled>
          Montréal (full)
        </SelectItem>
      </SelectSection>
    </Select>
  ),
};

export const Required: Story = {
  args: { children: null },
  render: () => (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Select label="Plan" placeholder="Choose a plan" isRequired name="plan">
        <SelectItem id="free">Free</SelectItem>
        <SelectItem id="team">Team</SelectItem>
      </Select>
      <Button type="submit">Continue</Button>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await waitFor(() =>
      expect(canvasElement.querySelector('.carved-select')).toHaveAttribute('data-invalid'),
    );
  },
};

export const Disabled: Story = {
  args: { label: 'Workspace', isDisabled: true, defaultValue: 'design', children: null },
  render: (args) => (
    <Select {...args}>
      <SelectItem id="design">Design</SelectItem>
    </Select>
  ),
};

const tools = ['Documentation', 'Design system', 'Deploys', 'Billing', 'Members', 'Usage'].map(
  (name) => ({ id: name.toLowerCase(), name }),
);

export const Combo: Story = {
  args: { children: null },
  render: () => (
    <ComboBox
      label="Jump to"
      placeholder="Type to filter"
      defaultItems={tools}
      description="Filters as you type."
    >
      {(item) => <ComboBoxItem>{item.name}</ComboBoxItem>}
    </ComboBox>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox');
    await userEvent.type(input, 'Doc');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('Documentation');
  },
};

export const StandaloneListBox: Story = {
  args: { children: null },
  render: () => (
    <ListBox
      aria-label="Members"
      selectionMode="multiple"
      defaultSelectedKeys={['ada']}
      className="carved-carve"
      style={{ borderRadius: 10 }}
    >
      <ListBoxItem id="ada">Ada Lovelace</ListBoxItem>
      <ListBoxItem id="grace">Grace Hopper</ListBoxItem>
      <ListBoxItem id="alan">Alan Turing</ListBoxItem>
    </ListBox>
  ),
};

/** A custom trigger built from the parts. */
export const CustomLayout: Story = {
  args: { children: null },
  render: () => (
    <SelectRoot defaultValue="weekly" aria-label="Digest">
      <Label>Digest</Label>
      <Button variant="secondary">
        Send me a digest: <SelectValue />
      </Button>
      <Popover>
        <ListBox>
          <ListBoxItem id="daily">Daily</ListBoxItem>
          <ListBoxItem id="weekly">Weekly</ListBoxItem>
          <ListBoxItem id="never">Never</ListBoxItem>
        </ListBox>
      </Popover>
    </SelectRoot>
  ),
};
