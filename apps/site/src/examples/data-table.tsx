import { useMemo, useState } from 'react';
import {
  Badge,
  Cell,
  Column,
  DataTable,
  DataTableBody,
  DataTableHeader,
  Row,
  useLocale,
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
  const { locale } = useLocale();
  const sorted = useMemo(() => {
    // Sort as people read: by the locale's alphabet, and numbers by their value.
    const collator = new Intl.Collator(locale, { numeric: true });
    const key = sort.column as keyof Deploy;
    const order = [...deploys].sort((a, b) => collator.compare(String(a[key]), String(b[key])));
    return sort.direction === 'descending' ? order.reverse() : order;
  }, [sort, locale]);
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
