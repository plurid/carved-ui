import { useMemo, useState } from 'react';
import {
  Badge,
  Cell,
  Column,
  DataTable,
  DataTableBody,
  DataTableHeader,
  Row,
  TableLayout,
  useLocale,
  Virtualizer,
} from '@plurid/carved-ui-react';
import type { SortDescriptor } from '@plurid/carved-ui-react';

const regions = ['Frankfurt', 'Virginia', 'São Paulo', 'Tokyo', 'Sydney', 'Mumbai'];
const branches = ['main', 'release', 'docs', 'search', 'billing'];

// Ten thousand deploys, the same on every render.
const deploys = Array.from({ length: 10_000 }, (_, index) => ({
  id: index + 1,
  commit: ((index * 2_654_435_761) >>> 0).toString(16).padStart(8, '0').slice(0, 7),
  branch: branches[(index * 7) % branches.length]!,
  region: regions[(index * 11) % regions.length]!,
  seconds: 20 + ((index * 37) % 160),
  failed: index % 23 === 0,
}));

export default function Example() {
  const { locale } = useLocale();
  const [sort, setSort] = useState<SortDescriptor>({ column: 'id', direction: 'descending' });
  const sorted = useMemo(() => {
    const collator = new Intl.Collator(locale, { numeric: true });
    const key = sort.column as keyof (typeof deploys)[number];
    const order = [...deploys].sort((a, b) => collator.compare(String(a[key]), String(b[key])));
    return sort.direction === 'descending' ? order.reverse() : order;
  }, [sort, locale]);
  return (
    <div style={{ blockSize: '24rem' }}>
      <Virtualizer layout={TableLayout}>
        <DataTable
          aria-label="Deploys"
          isResizable
          selectionMode="multiple"
          sortDescriptor={sort}
          onSortChange={setSort}
        >
          <DataTableHeader>
            <Column id="id" isRowHeader allowsSorting allowsResizing defaultWidth={110}>
              Deploy
            </Column>
            <Column id="commit" allowsResizing>
              Commit
            </Column>
            <Column id="branch" allowsSorting allowsResizing>
              Branch
            </Column>
            <Column id="region" allowsSorting allowsResizing>
              Region
            </Column>
            <Column id="seconds" allowsSorting defaultWidth={120}>
              Duration
            </Column>
          </DataTableHeader>
          <DataTableBody items={sorted}>
            {(deploy) => (
              <Row>
                <Cell>#{deploy.id}</Cell>
                <Cell>
                  <code>{deploy.commit}</code>
                </Cell>
                <Cell>{deploy.branch}</Cell>
                <Cell>{deploy.region}</Cell>
                <Cell>
                  {deploy.failed ? <Badge tone="danger">Failed</Badge> : `${deploy.seconds} s`}
                </Cell>
              </Row>
            )}
          </DataTableBody>
        </DataTable>
      </Virtualizer>
    </div>
  );
}
