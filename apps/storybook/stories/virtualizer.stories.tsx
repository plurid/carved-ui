import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Cell,
  Column,
  DataTable,
  DataTableBody,
  DataTableHeader,
  GridLayout,
  GridList,
  GridListItem,
  ListBox,
  ListBoxItem,
  Row,
  TableLayout,
  Tree,
  TreeItem,
  Virtualizer,
} from '@plurid/carved-ui-react';
import type { SortDescriptor } from '@plurid/carved-ui-react';

const meta = {
  title: 'Collections/Virtualizer',
  component: Virtualizer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Virtualizer>;
export default meta;
type Story = StoryObj<typeof meta>;

const people = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Person ${index + 1}`,
  team: ['Design', 'Research', 'Platform', 'Billing'][index % 4]!,
}));

export const List: Story = {
  args: { children: null },
  render: () => (
    <div className="lab-narrow">
      <Virtualizer>
        <ListBox
          aria-label="People"
          items={people}
          selectionMode="single"
          style={{ blockSize: '16rem' }}
        >
          {(person) => <ListBoxItem>{person.name}</ListBoxItem>}
        </ListBox>
      </Virtualizer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: 'Person 2' }));
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvas.getByRole('option', { name: 'Person 1000' })).toHaveFocus());
    await expect(canvas.getByRole('option', { name: 'Person 2' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const Tiles: Story = {
  args: { children: null },
  render: () => (
    <Virtualizer layout={GridLayout}>
      <GridList
        aria-label="Photos"
        layout="grid"
        items={people}
        selectionMode="multiple"
        style={{ blockSize: '20rem' }}
      >
        {(person) => <GridListItem textValue={person.name}>{person.name}</GridListItem>}
      </GridList>
    </Virtualizer>
  ),
};

export const NestedTree: Story = {
  args: { children: null },
  render: () => (
    <div className="lab-narrow">
      <Virtualizer>
        <Tree aria-label="Teams" defaultExpandedKeys={['Design']} style={{ blockSize: '18rem' }}>
          {['Design', 'Research', 'Platform', 'Billing'].map((team) => (
            <TreeItem key={team} id={team} title={team}>
              {people
                .filter((person) => person.team === team)
                .slice(0, 40)
                .map((person) => (
                  <TreeItem key={person.id} id={person.id} title={person.name} />
                ))}
            </TreeItem>
          ))}
        </Tree>
      </Virtualizer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Only the rows in view render: Research is far below Design's people until Design closes.
    await expect(canvas.queryByRole('row', { name: 'Research' })).toBeNull();
    const design = canvas.getByRole('row', { name: 'Design' });
    await userEvent.click(design);
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(design).toHaveAttribute('aria-expanded', 'false'));
    const research = await canvas.findByRole('row', { name: 'Research' });
    await userEvent.keyboard('{ArrowDown}{ArrowRight}');
    await waitFor(() => expect(research).toHaveAttribute('aria-expanded', 'true'));
  },
};

function SortableTable() {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'id', direction: 'ascending' });
  const rows = useMemo(() => {
    const order = [...people].sort((a, b) =>
      String(a[sort.column as 'team']).localeCompare(String(b[sort.column as 'team']), 'en', {
        numeric: true,
      }),
    );
    return sort.direction === 'descending' ? order.reverse() : order;
  }, [sort]);
  return (
    <div style={{ blockSize: '20rem' }}>
      <Virtualizer layout={TableLayout}>
        <DataTable
          aria-label="People"
          isResizable
          selectionMode="multiple"
          sortDescriptor={sort}
          onSortChange={setSort}
        >
          <DataTableHeader>
            <Column id="id" isRowHeader allowsSorting allowsResizing>
              Number
            </Column>
            <Column id="name" allowsResizing>
              Name
            </Column>
            <Column id="team" allowsSorting>
              Team
            </Column>
          </DataTableHeader>
          <DataTableBody items={rows}>
            {(person) => (
              <Row>
                <Cell>{person.id}</Cell>
                <Cell>{person.name}</Cell>
                <Cell>{person.team}</Cell>
              </Row>
            )}
          </DataTableBody>
        </DataTable>
      </Virtualizer>
    </div>
  );
}

export const Table: Story = {
  args: { children: null },
  render: () => <SortableTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('grid', { name: 'People' });
    await expect(grid).toHaveAttribute('aria-rowcount', '1001');
    await userEvent.click(canvas.getByRole('columnheader', { name: /Number/ }));
    await waitFor(() =>
      expect(canvas.getByRole('columnheader', { name: /Number/ })).toHaveAttribute(
        'aria-sort',
        'descending',
      ),
    );
    await expect(canvas.getAllByRole('rowheader')[0]).toHaveTextContent('1000');
  },
};
