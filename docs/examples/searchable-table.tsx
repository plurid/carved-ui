'use client';
import { useState } from 'react';
import {
  Badge,
  SearchField,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@plurid/carved-ui-react';
import { EmptyState } from './empty-state';

export interface Project {
  id: string;
  name: string;
  owner: string;
  status: 'Live' | 'Paused' | 'Failed';
}

const tones = { Live: 'success', Paused: 'neutral', Failed: 'danger' } as const;

/** A native table filtered by a search field. Sorting and server queries belong to the app. */
export function SearchableTable({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLocaleLowerCase();
  const results = projects.filter((project) =>
    `${project.name} ${project.owner}`.toLocaleLowerCase().includes(needle),
  );
  return (
    <div className="recipe-stack">
      <SearchField
        label="Search projects"
        description="Matches project names and owners."
        value={query}
        onChange={setQuery}
        className="recipe-search"
      />
      <p role="status" className="recipe-status">
        {results.length} of {projects.length} projects
      </p>
      {results.length > 0 ? (
        <Table>
          <TableCaption>Projects</TableCaption>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Owner</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((project) => (
              <TableRow key={project.id}>
                <TableHeader scope="row">{project.name}</TableHeader>
                <TableCell>{project.owner}</TableCell>
                <TableCell>
                  <Badge tone={tones[project.status]}>{project.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState title="No matching projects">Try a shorter or different search.</EmptyState>
      )}
    </div>
  );
}
