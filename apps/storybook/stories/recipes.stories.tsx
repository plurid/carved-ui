import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { AppShell } from '../../../docs/examples/app-shell';
import { ConfirmAction } from '../../../docs/examples/confirm-action';
import { EmptyState } from '../../../docs/examples/empty-state';
import { Pagination } from '../../../docs/examples/pagination';
import { SearchableTable } from '../../../docs/examples/searchable-table';
import { SettingsForm } from '../../../docs/examples/settings-form';
import type { Project } from '../../../docs/examples/searchable-table';
import '../../../docs/examples/recipes.css';
import { Button } from '@plurid/carved-ui-react';

const meta = { title: 'Recipes/Patterns', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const page = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

export const Settings: Story = {
  render: () => <SettingsForm save={() => wait(300)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Settings saved.'));
  },
};

export const SettingsFailure: Story = {
  render: () => (
    <SettingsForm save={() => wait(200).then(() => Promise.reject(new Error('Offline')))} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }));
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('could not be saved'));
  },
};

export const Confirmation: Story = {
  render: () => <ConfirmAction remove={() => wait(300)} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Delete project' });
    await userEvent.click(trigger);
    await userEvent.click(
      await page(canvasElement).findByRole('button', { name: 'Delete permanently' }),
    );
    await waitFor(() => expect(page(canvasElement).queryByRole('alertdialog')).toBeNull());
  },
};

export const ConfirmationFailure: Story = {
  render: () => (
    <ConfirmAction remove={() => wait(200).then(() => Promise.reject(new Error('Forbidden')))} />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Delete project' }));
    await userEvent.click(
      await page(canvasElement).findByRole('button', { name: 'Delete permanently' }),
    );
    const dialog = page(canvasElement).getByRole('alertdialog');
    await waitFor(() =>
      expect(within(dialog).getByRole('alert')).toHaveTextContent('could not be deleted'),
    );
    await userEvent.keyboard('{Escape}');
  },
};

const projects: Project[] = [
  { id: '1', name: 'Quarry', owner: 'Ada Lovelace', status: 'Live' },
  { id: '2', name: 'Basalt', owner: 'Grace Hopper', status: 'Paused' },
  { id: '3', name: 'Granite', owner: 'Alan Turing', status: 'Failed' },
  { id: '4', name: 'Marble', owner: 'Ada Lovelace', status: 'Live' },
];

export const Search: Story = {
  render: () => <SearchableTable projects={projects} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('searchbox'), 'ada');
    await expect(canvas.getByRole('status')).toHaveTextContent('2 of 4 projects');
    await userEvent.type(canvas.getByRole('searchbox'), 'zzz');
    await expect(canvas.getByRole('heading', { name: 'No matching projects' })).toBeVisible();
  },
};

export const Empty: Story = {
  render: () => (
    <EmptyState title="No projects yet" action={<Button>Create a project</Button>}>
      Projects you create or join appear here.
    </EmptyState>
  ),
};

export const Pages: Story = {
  render: () => <Pagination page={2} pages={5} href={(number) => `#page-${number}`} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

export const Shell: Story = {
  render: () => (
    <AppShell title="Projects">
      <SearchableTable projects={projects} />
    </AppShell>
  ),
};
