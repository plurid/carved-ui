import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Alert,
  Progress,
  Label,
  Spinner,
  Skeleton,
  EmptyState,
  Button,
  ToastQueue,
  ToastRegion,
  Toast,
  ToastContent,
  Text,
} from '@plurid/carved-ui-react';
const meta = { title: 'Feedback/States', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Alerts: Story = {
  render: () => (
    <div className="lab-stack lab-field">
      <Alert>Your project has been saved.</Alert>
      <Alert tone="success">All changes are synced.</Alert>
      <Alert tone="warning">Some changes have not synced yet.</Alert>
      <Alert tone="danger">The project could not be saved. Try again.</Alert>
    </div>
  ),
};
export const ProgressControl: Story = {
  render: () => (
    <div className="lab-stack lab-field">
      <Progress value={65}>
        <Label>Upload progress</Label>
      </Progress>
      <Progress isIndeterminate aria-label="Preparing files" />
      <Progress value={100} aria-label="Upload complete" />
    </div>
  ),
};
export const SpinnerControl: Story = {
  render: () => (
    <div className="lab-row">
      <Spinner />
      <span>Loading projects…</span>
    </div>
  ),
};
export const SkeletonControl: Story = {
  render: () => (
    <div className="lab-stack lab-field" role="status" aria-label="Loading project details">
      <Skeleton style={{ width: '60%', height: '1.5rem' }} />
      <Skeleton />
      <Skeleton style={{ width: '80%' }} />
    </div>
  ),
};
export const EmptyStateControl: Story = {
  render: () => (
    <EmptyState title="No projects yet" action={<Button>Create a project</Button>}>
      <p>Create your first project to start working with your team.</p>
    </EmptyState>
  ),
};
function ToastExample() {
  const [queue] = useState(
    () => new ToastQueue<{ title: string; description: string }>({ maxVisibleToasts: 3 }),
  );
  return (
    <>
      <Button
        onPress={() =>
          queue.add({ title: 'Changes saved', description: 'Your project is up to date.' })
        }
      >
        Save project
      </Button>
      <ToastRegion queue={queue}>
        {({ toast }) => (
          <Toast toast={toast}>
            <ToastContent>
              <Text slot="title">{toast.content.title}</Text>
              <Text slot="description">{toast.content.description}</Text>
            </ToastContent>
            <Button slot="close" variant="ghost" aria-label="Dismiss notification">
              Dismiss
            </Button>
          </Toast>
        )}
      </ToastRegion>
    </>
  );
}
export const ToastControl: Story = {
  render: () => <ToastExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Save project' }));
    await expect(await page.findByText('Changes saved')).toBeVisible();
    await userEvent.click(page.getByRole('button', { name: 'Dismiss notification' }));
    await expect(page.queryByText('Changes saved')).not.toBeInTheDocument();
  },
};
