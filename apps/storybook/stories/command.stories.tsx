import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  CommandItem,
  CommandPalette,
  CommandSection,
  DialogTrigger,
  Kbd,
} from '@plurid/carved-ui-react';
import type { Key } from '@plurid/carved-ui-react';

const meta = {
  title: 'Overlays/Command palette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CommandPalette>;
export default meta;
type Story = StoryObj<typeof meta>;

function Palette() {
  const [ran, setRan] = useState<Key | null>(null);
  return (
    <div className="lab-row">
      <DialogTrigger>
        <Button variant="secondary">
          Search commands <Kbd>⌘K</Kbd>
        </Button>
        <CommandPalette onAction={setRan}>
          <CommandSection title="Project">
            <CommandItem id="new" shortcut="⌘N">
              New project
            </CommandItem>
            <CommandItem id="invite">Invite people</CommandItem>
          </CommandSection>
          <CommandSection title="Go to">
            <CommandItem id="settings">Settings</CommandItem>
            <CommandItem id="billing">Billing</CommandItem>
          </CommandSection>
        </CommandPalette>
      </DialogTrigger>
      <output aria-label="Last command">{ran}</output>
    </div>
  );
}

export const Commands: Story = {
  render: () => <Palette />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.keyboard('{Control>}k{/Control}');
    const search = await body.findByRole('searchbox', { name: 'Search commands' });
    await waitFor(() => expect(search).toHaveFocus());
    await userEvent.keyboard('bill');
    await expect(body.queryByRole('menuitem', { name: 'Settings' })).not.toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(canvas.getByLabelText('Last command')).toHaveTextContent('billing');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const FromTrigger: Story = {
  render: () => <Palette />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: /Search commands/ }));
    await body.findByRole('dialog', { name: 'Commands' });
    await userEvent.keyboard('zzz');
    await expect(body.getByText('No matching commands')).toBeVisible();
    await userEvent.keyboard('{Escape}{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
