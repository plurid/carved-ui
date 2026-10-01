import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  Menu,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
  SubmenuTrigger,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Collections/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="lab-tall">{Story()}</div>],
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

const onAction = fn();

export const Actions: Story = {
  args: { onAction },
  render: (args) => (
    <MenuTrigger>
      <Button variant="secondary">Project</Button>
      <Menu aria-label="Project" onAction={args.onAction}>
        <MenuItem id="rename" shortcut="⌘R">
          Rename
        </MenuItem>
        <MenuItem id="duplicate" shortcut="⌘D">
          Duplicate
        </MenuItem>
        <MenuSeparator />
        <MenuItem id="archive" isDisabled>
          Archive
        </MenuItem>
        <MenuItem id="delete">Delete</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Project' });
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
    await userEvent.click(body.getByRole('menuitem', { name: /Duplicate/ }));
    await expect(onAction.mock.calls[0]?.[0]).toBe('duplicate');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Selection: Story = {
  render: () => {
    const [sort, setSort] = useState(new Set(['updated']));
    return (
      <MenuTrigger>
        <Button variant="secondary">Sort</Button>
        <Menu
          aria-label="Sort"
          selectionMode="single"
          selectedKeys={sort}
          onSelectionChange={(keys) => setSort(new Set([...keys].map(String)))}
        >
          <MenuSection title="Sort by">
            <MenuItem id="name">Name</MenuItem>
            <MenuItem id="updated">Last updated</MenuItem>
            <MenuItem id="size">Size</MenuItem>
          </MenuSection>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const Submenu: Story = {
  render: () => (
    <MenuTrigger>
      <Button variant="secondary">Share</Button>
      <Menu aria-label="Share">
        <MenuItem id="copy">Copy link</MenuItem>
        <SubmenuTrigger>
          <MenuItem id="send">Send to</MenuItem>
          <Menu aria-label="Send to">
            <MenuItem id="email">Email</MenuItem>
            <MenuItem id="chat">Chat</MenuItem>
          </Menu>
        </SubmenuTrigger>
      </Menu>
    </MenuTrigger>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Share' }));
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Send to' })).toBeVisible());
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}');
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Email' })).toBeVisible());
  },
};
