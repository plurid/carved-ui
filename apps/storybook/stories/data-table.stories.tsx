import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Badge,
  Cell,
  Column,
  DataTable,
  DataTableBody,
  DataTableHeader,
  Row,
  Spinner,
} from '@plurid/carved-ui-react';
import type { SortDescriptor } from '@plurid/carved-ui-react';

const meta = {
  title: 'Collections/Data table',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataTable>;
export default meta;
type Story = StoryObj<typeof meta>;

const deploys = [
  { id: 'a41f', branch: 'main', region: 'Frankfurt', seconds: 48, live: true },
  { id: '9c02', branch: 'main', region: 'Virginia', seconds: 52, live: true },
  { id: '77e1', branch: 'fix/cache', region: 'Amsterdam', seconds: 63, live: false },
  { id: '3b9d', branch: 'feat/search', region: 'São Paulo', seconds: 71, live: true },
];
type Deploy = (typeof deploys)[number];

function Deploys({
  selectionMode = 'multiple',
}: {
  selectionMode?: 'none' | 'single' | 'multiple';
}) {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'id', direction: 'ascending' });
  const rows = useMemo(() => {
    const key = sort.column as keyof Deploy;
    const sorted = [...deploys].sort((a, b) => String(a[key]).localeCompare(String(b[key])));
    return sort.direction === 'descending' ? sorted.reverse() : sorted;
  }, [sort]);
  return (
    <DataTable
      aria-label="Deploys"
      selectionMode={selectionMode}
      sortDescriptor={sort}
      onSortChange={setSort}
    >
      <DataTableHeader>
        <Column id="id" isRowHeader allowsSorting>
          Commit
        </Column>
        <Column id="branch" allowsSorting>
          Branch
        </Column>
        <Column id="region" allowsSorting>
          Region
        </Column>
        <Column id="live">Status</Column>
      </DataTableHeader>
      <DataTableBody items={rows}>
        {(deploy) => (
          <Row>
            <Cell>{deploy.id}</Cell>
            <Cell>{deploy.branch}</Cell>
            <Cell>{deploy.region}</Cell>
            <Cell>
              <Badge tone={deploy.live ? 'success' : 'danger'}>
                {deploy.live ? 'Live' : 'Failed'}
              </Badge>
            </Cell>
          </Row>
        )}
      </DataTableBody>
    </DataTable>
  );
}

const firstRow = (canvasElement: HTMLElement) => within(canvasElement).getAllByRole('row')[1];

export const Sorting: Story = {
  render: () => <Deploys />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole('columnheader', { name: /Region/ });
    await userEvent.click(region);
    await expect(region).toHaveAttribute('aria-sort', 'ascending');
    await expect(firstRow(canvasElement)).toHaveTextContent('Amsterdam');
    await userEvent.click(region);
    await expect(region).toHaveAttribute('aria-sort', 'descending');
    await expect(firstRow(canvasElement)).toHaveTextContent('Virginia');
  },
};

export const Selection: Story = {
  render: () => <Deploys />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: /select all/i }));
    for (const row of canvas.getAllByRole('row').slice(1))
      await expect(row).toHaveAttribute('aria-selected', 'true');
    // From the header, the arrow keys move into the rows; Space toggles the focused one.
    await userEvent.keyboard('{ArrowDown} ');
    await expect(canvas.getAllByRole('row')[1]).toHaveAttribute('aria-selected', 'false');
  },
};

export const SingleSelection: Story = {
  render: () => <Deploys selectionMode="single" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('checkbox')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('rowheader', { name: '9c02' }));
    await expect(canvas.getByRole('rowheader', { name: '9c02' }).closest('tr')).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const Resizable: Story = {
  render: () => (
    <DataTable aria-label="Files" isResizable>
      <DataTableHeader>
        <Column isRowHeader allowsResizing defaultWidth="1fr" minWidth={120}>
          Name
        </Column>
        <Column allowsResizing defaultWidth={160}>
          Owner
        </Column>
        <Column defaultWidth={100}>Size</Column>
      </DataTableHeader>
      <DataTableBody>
        <Row>
          <Cell>Brand guidelines.pdf</Cell>
          <Cell>Ana Pop</Cell>
          <Cell>4.2 MB</Cell>
        </Row>
        <Row>
          <Cell>Quarterly report.xlsx</Cell>
          <Cell>Ioan Marin</Cell>
          <Cell>860 KB</Cell>
        </Row>
      </DataTableBody>
    </DataTable>
  ),
};

export const Loading: Story = {
  render: () => (
    <DataTable aria-label="Invoices">
      <DataTableHeader>
        <Column isRowHeader>Invoice</Column>
        <Column>Amount</Column>
      </DataTableHeader>
      <DataTableBody renderEmptyState={() => <Spinner aria-label="Loading invoices" />}>
        {[]}
      </DataTableBody>
    </DataTable>
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable aria-label="Invoices">
      <DataTableHeader>
        <Column isRowHeader>Invoice</Column>
        <Column>Amount</Column>
      </DataTableHeader>
      <DataTableBody renderEmptyState={() => 'No invoices yet.'}>{[]}</DataTableBody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('No invoices yet.')).toBeVisible();
  },
};
