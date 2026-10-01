// @source ../../../../../docs/examples/searchable-table.tsx
import { SearchableTable } from '../../../../../docs/examples/searchable-table';

const projects = [
  { id: '1', name: 'Quarry', owner: 'Ada Lovelace', status: 'Live' },
  { id: '2', name: 'Basalt', owner: 'Grace Hopper', status: 'Paused' },
  { id: '3', name: 'Granite', owner: 'Alan Turing', status: 'Failed' },
  { id: '4', name: 'Marble', owner: 'Ada Lovelace', status: 'Live' },
] as const;

export default function Example() {
  return <SearchableTable projects={[...projects]} />;
}
