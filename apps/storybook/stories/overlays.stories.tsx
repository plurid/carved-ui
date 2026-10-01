import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  AlertDialog,
  Button,
  CarvedProvider,
  Dialog,
  DialogFooter,
  DialogTrigger,
  Drawer,
  IconButton,
  Modal,
  Popover,
  Surface,
  TextField,
  Tooltip,
  TooltipTrigger,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

const body = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

export const InModal: Story = {
  render: () => (
    <DialogTrigger>
      <Button>Rename project</Button>
      <Modal>
        <Dialog title="Rename project" description="The new name appears everywhere at once.">
          {({ close }) => (
            <>
              <TextField label="Name" defaultValue="Quarry" autoFocus />
              <DialogFooter>
                <Button variant="ghost" onPress={close}>
                  Cancel
                </Button>
                <Button onPress={close}>Rename</Button>
              </DialogFooter>
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Rename project' });
    await userEvent.click(trigger);
    const dialog = await body(canvasElement).findByRole('dialog', { name: 'Rename project' });
    await expect(dialog).toHaveAccessibleDescription('The new name appears everywhere at once.');
    await expect(body(canvasElement).getByRole('textbox', { name: 'Name' })).toHaveFocus();
    // Overlays render inside the provider, so they inherit its theme.
    await expect(dialog.closest('[data-carved-theme]')).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Confirmation: Story = {
  render: () => {
    const [deleted, setDeleted] = useState(false);
    return (
      <div className="lab-row">
        <DialogTrigger>
          <Button variant="danger">Delete project</Button>
          <Modal size="sm">
            <AlertDialog
              title="Delete Quarry?"
              actionLabel="Delete project"
              onAction={() =>
                new Promise<void>((resolve) =>
                  setTimeout(() => {
                    setDeleted(true);
                    resolve();
                  }, 400),
                )
              }
            >
              Its deploys and history are removed. This cannot be undone.
            </AlertDialog>
          </Modal>
        </DialogTrigger>
        <output aria-label="Status">{deleted ? 'Deleted' : 'Active'}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Delete project' }));
    const dialog = await body(canvasElement).findByRole('alertdialog');
    await expect(within(dialog).getByRole('button', { name: 'Delete project' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(within(canvasElement).getByLabelText('Status')).toHaveTextContent('Deleted'),
    );
  },
};

export const Drawers: Story = {
  render: () => (
    <div className="lab-row">
      {(['start', 'end', 'bottom'] as const).map((placement) => (
        <DialogTrigger key={placement}>
          <Button variant="secondary">Open {placement}</Button>
          <Drawer placement={placement} isDismissable>
            <Dialog title="Filters" description="Narrow the list of projects.">
              <TextField label="Owner" />
            </Dialog>
          </Drawer>
        </DialogTrigger>
      ))}
    </div>
  ),
};

export const PopoverDialog: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="secondary">Details</Button>
      <Popover showArrow placement="bottom start">
        <Dialog title="Quarry" description="Deployed four minutes ago from main." />
      </Popover>
    </DialogTrigger>
  ),
};

const Info = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5v.01" strokeLinecap="round" />
  </svg>
);

export const Tooltips: Story = {
  render: () => (
    <div className="lab-row" style={{ paddingBlock: '3rem' }}>
      <TooltipTrigger delay={0}>
        <IconButton aria-label="About deploys" variant="secondary">
          <Info />
        </IconButton>
        <Tooltip showArrow>Deploys run on every push to main.</Tooltip>
      </TooltipTrigger>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await waitFor(() => expect(body(canvasElement).getByRole('tooltip')).toBeVisible());
  },
};

export const OpenOnFirstRender: Story = {
  render: () => (
    <DialogTrigger defaultOpen>
      <Button>Show welcome</Button>
      <Modal>
        <Dialog title="Welcome to Quarry">Every project starts here.</Dialog>
      </Modal>
    </DialogTrigger>
  ),
  play: async ({ canvasElement }) => {
    const dialog = await body(canvasElement).findByRole('dialog', { name: 'Welcome to Quarry' });
    await waitFor(() => expect(dialog.closest('.carved-portal-host')).not.toBeNull());
  },
};

/** A nested provider themes its own overlays, wherever they render. */
export const ScopedTheme: Story = {
  render: () => (
    <div className="lab-row">
      <CarvedProvider theme="furor">
        <Surface className="lab-pad">
          <DialogTrigger>
            <Button>Open in furor</Button>
            <Modal>
              <Dialog title="Scoped theme">
                This dialog keeps the furor theme of its provider.
              </Dialog>
            </Modal>
          </DialogTrigger>
        </Surface>
      </CarvedProvider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open in furor' }));
    const dialog = await body(canvasElement).findByRole('dialog');
    await expect(dialog.closest('[data-carved-theme]')).toHaveAttribute(
      'data-carved-theme',
      'furor',
    );
    await userEvent.keyboard('{Escape}');
  },
};
