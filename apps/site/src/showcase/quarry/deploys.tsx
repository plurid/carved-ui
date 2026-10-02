import { useDeferredValue, useMemo, useState, useTransition } from 'react';
import type { CalendarDate } from '@internationalized/date';
import {
  Badge,
  Cell,
  Column,
  DataTable,
  DataTableBody,
  DataTableHeader,
  DateRangePicker,
  Heading,
  Row,
  SearchField,
  TableLayout,
  ToggleButton,
  ToggleButtonGroup,
  useLocale,
  Virtualizer,
} from '@plurid/carved-ui-react';
import type { Key, SortDescriptor } from '@plurid/carved-ui-react';
import { useTimes } from '../shared/time';
import { dayOf, statuses } from './data';
import type { Deploy, Status } from './data';

interface DeploysProps {
  deploys: Deploy[];
  onOpen: (deploy: Deploy) => void;
}

type Range = { start: CalendarDate; end: CalendarDate } | null;

/**
 * Every deploy of the project in one virtualized table: search it, narrow it by status and by
 * day, sort it by any column, and open a deploy for its details.
 */
export function Deploys({ deploys, onOpen }: DeploysProps) {
  const { locale } = useLocale();
  const times = useTimes();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [range, setRange] = useState<Range>(null);
  const [sort, setSort] = useState<SortDescriptor>({ column: 'started', direction: 'descending' });
  const [sorting, startSorting] = useTransition();
  // Typing stays quick: the table catches up with the search when it can.
  const query = useDeferredValue(search.trim().toLowerCase());

  const shown = useMemo(() => {
    const from = range?.start.toString();
    const to = range?.end.toString();
    const matching = deploys.filter((deploy) => {
      if (status !== 'all' && deploy.status !== status) return false;
      if (from && to) {
        const day = dayOf(deploy.started);
        if (day < from || day > to) return false;
      }
      return (
        !query ||
        `${deploy.id} ${deploy.commit} ${deploy.message} ${deploy.branch} ${deploy.author}`
          .toLowerCase()
          .includes(query)
      );
    });
    const key = sort.column as keyof Deploy;
    const collator = new Intl.Collator(locale, { numeric: true });
    matching.sort((a, b) =>
      typeof a[key] === 'number'
        ? (a[key] as number) - (b[key] as number)
        : collator.compare(String(a[key]), String(b[key])),
    );
    return sort.direction === 'descending' ? matching.reverse() : matching;
  }, [deploys, status, range, query, sort, locale]);

  const count = new Intl.NumberFormat(locale).format(shown.length);
  return (
    <div className="quarry-page quarry-deploys">
      <header className="quarry-page-head">
        <Heading level={1}>Deploys</Heading>
        <p className="quarry-muted" aria-live="polite">
          {count} {shown.length === 1 ? 'deploy' : 'deploys'}
        </p>
      </header>
      <div className="quarry-filters">
        <SearchField
          aria-label="Search deploys"
          placeholder="Commit, branch, message or author"
          value={search}
          onChange={setSearch}
          className="quarry-search"
        />
        <ToggleButtonGroup
          aria-label="Status"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[status]}
          onSelectionChange={(keys) => setStatus([...keys][0] as Status | 'all')}
        >
          <ToggleButton id="all" size="sm">
            All
          </ToggleButton>
          {statuses
            .filter((item) => item.id !== 'ready' && item.id !== 'canceled')
            .map((item) => (
              <ToggleButton key={item.id} id={item.id} size="sm">
                {item.name}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
        <DateRangePicker aria-label="Started between" value={range} onChange={setRange} />
      </div>
      <div className="quarry-table" data-pending={sorting || undefined}>
        <Virtualizer layout={TableLayout}>
          <DataTable
            aria-label="Deploys"
            isResizable
            sortDescriptor={sort}
            onSortChange={(next) => startSorting(() => setSort(next))}
            onRowAction={(key: Key) => {
              const deploy = deploys.find((item) => item.id === key);
              if (deploy) onOpen(deploy);
            }}
          >
            <DataTableHeader>
              <Column id="id" isRowHeader allowsSorting allowsResizing defaultWidth={104}>
                Deploy
              </Column>
              <Column id="message" allowsSorting allowsResizing defaultWidth="2fr">
                Change
              </Column>
              <Column id="branch" allowsSorting allowsResizing defaultWidth={120}>
                Branch
              </Column>
              <Column id="author" allowsSorting allowsResizing defaultWidth={150}>
                Author
              </Column>
              <Column id="status" allowsSorting allowsResizing defaultWidth={116}>
                Status
              </Column>
              <Column id="started" allowsSorting allowsResizing defaultWidth={140}>
                Started
              </Column>
              <Column id="seconds" allowsSorting defaultWidth={100}>
                Took
              </Column>
            </DataTableHeader>
            <DataTableBody
              items={shown}
              renderEmptyState={() => 'No deploys match. Try another status or range.'}
            >
              {(deploy) => {
                const tone = statuses.find((item) => item.id === deploy.status)!;
                return (
                  <Row id={deploy.id} textValue={`Deploy ${deploy.id}`}>
                    <Cell>#{deploy.id}</Cell>
                    <Cell>
                      <code className="quarry-commit">{deploy.commit}</code> {deploy.message}
                    </Cell>
                    <Cell>{deploy.branch}</Cell>
                    <Cell>{deploy.author}</Cell>
                    <Cell>
                      <Badge tone={tone.tone}>{tone.name}</Badge>
                    </Cell>
                    <Cell>{times.ago(deploy.started)}</Cell>
                    <Cell>{deploy.seconds ? `${deploy.seconds} s` : '—'}</Cell>
                  </Row>
                );
              }}
            </DataTableBody>
          </DataTable>
        </Virtualizer>
      </div>
    </div>
  );
}
