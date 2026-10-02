import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Alert,
  Button,
  Meter,
  ProgressBar,
  Skeleton,
  Spinner,
  ToastQueue,
  ToastRegion,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div className="lab-stack">
      <Alert title="Heads up">Maintenance starts at 02:00 UTC.</Alert>
      <Alert tone="accent" title="New">
        Projects can now be grouped into folders.
      </Alert>
      <Alert tone="success" title="Deployed">
        Version 1.4 is live in every region.
      </Alert>
      <Alert tone="warning" title="Quota at 80%">
        Storage will fill in about nine days.
      </Alert>
      <Alert
        tone="danger"
        title="Deploy failed"
        action={
          <Button size="sm" variant="secondary">
            Retry
          </Button>
        }
      >
        The build step exited with code 1.
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Alerts present on load are not live regions.
    await expect(within(canvasElement).queryByRole('alert')).toBeNull();
  },
};

export const Announced: Story = {
  render: () => {
    const [failed, setFailed] = useState(false);
    return (
      <div className="lab-stack">
        <Button onPress={() => setFailed(true)}>Deploy</Button>
        {failed && (
          <Alert tone="danger" live="assertive" title="Deploy failed">
            The build step exited with code 1.
          </Alert>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Deploy' }));
    await expect(canvas.getByRole('alert')).toHaveTextContent('Deploy failed');
  },
};

export const Progress: Story = {
  render: () => (
    <div className="lab-stack lab-narrow">
      <ProgressBar label="Uploading" value={64} />
      <ProgressBar label="Preparing" />
      <div className="lab-row">
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" aria-label="Loading projects" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar', { name: 'Uploading' })).toHaveAttribute(
      'aria-valuenow',
      '64',
    );
    await expect(canvas.getByRole('progressbar', { name: 'Loading projects' })).toBeVisible();
  },
};

export const Placeholders: Story = {
  render: () => (
    <div className="lab-stack lab-narrow">
      <Skeleton style={{ blockSize: '1.5rem', inlineSize: '60%' }} />
      <Skeleton />
      <Skeleton style={{ inlineSize: '80%' }} />
    </div>
  ),
};

const toasts = new ToastQueue({ maxVisibleToasts: 3 });

export const Toasts: Story = {
  render: () => (
    <div className="lab-row">
      <Button
        variant="secondary"
        onPress={() => toasts.add({ title: 'Project saved', tone: 'success' }, { timeout: 5000 })}
      >
        Save
      </Button>
      <Button
        variant="secondary"
        onPress={() =>
          toasts.add({
            title: 'Project archived',
            description: 'It is hidden from the list.',
            action: {
              label: 'Undo',
              onAction: () => toasts.add({ title: 'Restored' }, { timeout: 3000 }),
            },
          })
        }
      >
        Archive
      </Button>
      <ToastRegion queue={toasts} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Save' }));
    const page = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(page.getByText('Project saved')).toBeVisible());
    await userEvent.click(page.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(page.queryByText('Project saved')).toBeNull());
  },
};

export const Meters: Story = {
  render: () => (
    <div className="lab-stack">
      <Meter label="Storage" value={42} valueLabel="42 of 100 GB" />
      <Meter label="Seats used" value={9} maxValue={10} tone="warning" />
      <Meter label="Error budget spent" value={97} tone="danger" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('meter', { name: 'Storage' })).toHaveAttribute(
      'aria-valuenow',
      '42',
    );
  },
};
