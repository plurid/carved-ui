'use client';
import { useId, useState } from 'react';
import {
  TextField,
  Label,
  Input,
  FieldDescription,
  Table,
  TableCaption,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  EmptyState,
  Badge,
} from '@plurid/carved-ui-react';
export interface ProjectRow {
  id: string;
  name: string;
  status: 'Active' | 'Archived';
}

/** A small native table. Pagination, sorting and server queries belong to the app. */
export function SearchableTable({ rows }: { rows: ProjectRow[] }) {
  const [query, setQuery] = useState('');
  const results = rows.filter((row) =>
    row.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const description = useId();
  return (
    <div className="lab-stack">
      <TextField value={query} onChange={setQuery} className="lab-field">
        <Label>Search projects</Label>
        <Input type="search" aria-describedby={description} />
        <FieldDescription id={description}>Search by project name.</FieldDescription>
      </TextField>
      <p role="status">
        {results.length} {results.length === 1 ? 'project' : 'projects'}
      </p>
      {results.length ? (
        <div className="lab-table-scroll">
          <Table>
            <TableCaption>Projects</TableCaption>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((row) => (
                <TableRow key={row.id}>
                  <TableHeader scope="row">{row.name}</TableHeader>
                  <TableCell>
                    <Badge>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="No matching projects">
          <p>Try a different project name.</p>
        </EmptyState>
      )}
    </div>
  );
}
