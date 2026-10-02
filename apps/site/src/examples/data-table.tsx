import { useMemo, useState } from 'react';
import {
  Badge,
  Cell,
  Column,
  DataTable,
  DataTableBody,
  DataTableHeader,
  Row,
} from '@plurid/carved-ui-react';
import type { Selection, SortDescriptor } from '@plurid/carved-ui-react';

const deploys = [
  { id: 'a41f', branch: 'main', region: 'Frankfurt', seconds: 48, live: true },
  { id: '9c02', branch: 'main', region: 'Virginia', seconds: 52, live: true },
  { id: '77e1', branch: 'fix/cache', region: 'Frankfurt', seconds: 63, live: false },
  { id: '3b9d', branch: 'feat/search', region: 'São Paulo', seconds: 71, live: true },
  { id: 'e5c0', branch: 'main', region: 'Singapore', seconds: 45, live: true },
];
type Deploy = (typeof deploys)[number];

export default function Example() {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'seconds', direction: 'ascending' });
  const [selected, setSelected] = useState<Selection>(new Set(['9c02']));
  const sorted = useMemo(() => {
    const key = sort.column as keyof Deploy;
    const order = [...deploys].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0));
    return sort.direction === 'descending' ? order.reverse() : order;
  }, [sort]);
  return (
    <DataTable
      aria-label="Deploys"
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
      sortDescriptor={sort}
      onSortChange={setSort}
    >
      <DataTableHeader>
        <Column id="id" isRowHeader>
          Commit
        </Column>
        <Column id="branch" allowsSorting>
          Branch
        </Column>
        <Column id="region" allowsSorting>
          Region
        </Column>
        <Column id="seconds" allowsSorting>
          Took
        </Column>
        <Column id="live">Status</Column>
      </DataTableHeader>
      <DataTableBody items={sorted}>
        {(deploy) => (
          <Row>
            <Cell>{deploy.id}</Cell>
            <Cell>{deploy.branch}</Cell>
            <Cell>{deploy.region}</Cell>
            <Cell>{deploy.seconds} s</Cell>
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
