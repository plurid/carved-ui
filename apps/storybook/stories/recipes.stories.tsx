import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, fn, userEvent, within } from 'storybook/test';
import { SettingsForm } from '../../../docs/examples/settings-form';
import { ConfirmAction } from '../../../docs/examples/confirm-action';
import { SearchableTable } from '../../../docs/examples/searchable-table';
import { AppShell } from '../../../docs/examples/app-shell';
const meta = { title: 'Recipes/Editable patterns', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Settings: Story = {
  render: () => <SettingsForm save={fn(async () => {})} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByRole('textbox'));
    await userEvent.type(canvas.getByRole('textbox'), 'New name');
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Settings saved.');
  },
};
export const FailedSettings: Story = {
  render: () => (
    <SettingsForm
      save={async () => {
        throw new Error('Unavailable');
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Try again.');
    await expect(canvas.getByRole('button')).toBeEnabled();
  },
};
export const Confirmation: Story = {
  render: () => <ConfirmAction remove={fn(async () => {})} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
    await expect(await page.findByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.click(page.getByRole('button', { name: 'Delete permanently' }));
    await expect(page.queryByRole('alertdialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
export const FailedConfirmation: Story = {
  render: () => (
    <ConfirmAction
      remove={async () => {
        throw new Error('Unavailable');
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button'));
    await userEvent.click(await page.findByRole('button', { name: 'Delete permanently' }));
    await expect(await page.findByRole('alert')).toHaveTextContent('Try again.');
    await userEvent.click(page.getByRole('button', { name: 'Cancel' }));
  },
};
const rows = [
  { id: 'carved', name: 'Carved UI', status: 'Active' as const },
  { id: 'docs', name: 'Documentation', status: 'Archived' as const },
];
export const Search: Story = {
  render: () => <SearchableTable rows={rows} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox');
    await userEvent.type(input, 'carved');
    await expect(canvas.getByRole('status')).toHaveTextContent('1 project');
    await expect(canvas.queryByText('Documentation')).not.toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, 'missing');
    await expect(canvas.getByText('No matching projects')).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('0 projects');
  },
};
export const Shell: Story = {
  render: () => (
    <AppShell>
      <SearchableTable rows={rows} />
    </AppShell>
  ),
};
