import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, userEvent, within } from 'storybook/test';
import {
  Button,
  CarvedProvider,
  DialogTrigger,
  DialogContent,
  Dialog,
  AlertDialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Drawer,
  TooltipTrigger,
  Tooltip,
  Popover,
  TextField,
  Label,
  Input,
  Surface,
} from '@plurid/carved-ui-react';
const meta = { title: 'Overlays/Dialog', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Modal: Story = {
  render: () => (
    <DialogTrigger>
      <Button>Edit project</Button>
      <DialogContent isDismissable>
        <Dialog>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>Change the name used throughout your workspace.</DialogDescription>
          <TextField autoFocus defaultValue="Carved UI">
            <Label>Project name</Label>
            <Input />
          </TextField>
          <DialogFooter>
            <Button slot="close" variant="secondary">
              Cancel
            </Button>
            <Button slot="close">Save changes</Button>
          </DialogFooter>
        </Dialog>
      </DialogContent>
    </DialogTrigger>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Edit project' });
    await userEvent.click(trigger);
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole('dialog', { name: 'Edit project' });
    await expect(within(dialog).getByRole('textbox')).toHaveFocus();
    await expect(dialog).toHaveAccessibleDescription(
      'Change the name used throughout your workspace.',
    );
    await userEvent.keyboard('{Escape}');
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
export const Confirmation: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="danger">Delete project</Button>
      <DialogContent>
        <AlertDialog>
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription>This removes the project from your workspace.</DialogDescription>
          <DialogFooter>
            <Button slot="close" autoFocus variant="secondary">
              Cancel
            </Button>
            <Button slot="close" variant="danger">
              Delete project
            </Button>
          </DialogFooter>
        </AlertDialog>
      </DialogContent>
    </DialogTrigger>
  ),
};
export const DrawerControl: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="secondary">Open settings</Button>
      <Drawer isDismissable>
        <Dialog>
          <DialogTitle>Project settings</DialogTitle>
          <DialogDescription>Configure how your team uses this project.</DialogDescription>
          <DialogFooter>
            <Button slot="close">Done</Button>
          </DialogFooter>
        </Dialog>
      </Drawer>
    </DialogTrigger>
  ),
};
export const TooltipControl: Story = {
  render: () => (
    <TooltipTrigger delay={0}>
      <Button variant="secondary">Archive</Button>
      <Tooltip>Move the project out of your active workspace.</Tooltip>
    </TooltipTrigger>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(
      await within(canvasElement.ownerDocument.body).findByRole('tooltip'),
    ).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};
export const PopoverControl: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="secondary">Project information</Button>
      <Popover>
        <Dialog>
          <DialogTitle>About this project</DialogTitle>
          <p>This example uses editable application content.</p>
          <Button slot="close">Close</Button>
        </Dialog>
      </Popover>
    </DialogTrigger>
  ),
};
function ControlledDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open controlled dialog</Button>
      <DialogContent isOpen={open} onOpenChange={setOpen} isDismissable>
        <Dialog>
          <DialogTitle>Controlled dialog</DialogTitle>
          <Button onPress={() => setOpen(false)}>Close controlled dialog</Button>
        </Dialog>
      </DialogContent>
    </>
  );
}
export const Controlled: Story = {
  render: () => <ControlledDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open controlled dialog' }));
    await expect(await page.findByRole('dialog', { name: 'Controlled dialog' })).toBeVisible();
    await userEvent.click(page.getByRole('button', { name: 'Close controlled dialog' }));
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
function ScopedPortal() {
  const [light, setLight] = useState(true);
  return (
    <CarvedProvider theme={light ? 'light' : 'night'} style={{ '--carved-accent': '#92cab7' }}>
      <Surface depth={3} className="lab-surface">
        <Button onPress={() => setLight((value) => !value)}>Toggle local theme</Button>
        <DialogTrigger>
          <Button variant="secondary">Open themed dialog</Button>
          <DialogContent isDismissable>
            <Dialog>
              <DialogTitle>Local theme</DialogTitle>
              <Button onPress={() => setLight((value) => !value)}>Change theme while open</Button>
              <Button slot="close">Done</Button>
            </Dialog>
          </DialogContent>
        </DialogTrigger>
      </Surface>
    </CarvedProvider>
  );
}
export const ScopedPortalTheme: Story = { render: () => <ScopedPortal /> };
