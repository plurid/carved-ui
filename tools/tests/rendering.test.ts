import { describe, expect, it } from 'vitest';
import { createElement as h } from 'react';
import type { ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { parseDate } from '@internationalized/date';
import { createTheme } from '@plurid/carved-ui-core';
import {
  Accordion,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Calendar,
  Card,
  CardHeader,
  CardTitle,
  CarvedProvider,
  Cell,
  ColorPicker,
  Column,
  CommandItem,
  CommandPalette,
  DataTable,
  DataTableBody,
  DataTableHeader,
  DatePicker,
  Disclosure,
  DropZone,
  Heading,
  IconButton,
  Kbd,
  Meter,
  NumberField,
  Pagination,
  Row,
  Select,
  SelectItem,
  Surface,
  Tag,
  TagGroup,
  TextField,
  Tree,
  TreeItem,
} from '@plurid/carved-ui-react';

const html = (node: ReactNode) => renderToString(node);

describe('server rendering', () => {
  it('renders a themed tree without browser globals', () => {
    const markup = html(
      h(
        CarvedProvider,
        { theme: createTheme({ color: '#456789' }) },
        h(Card, null, h(CardHeader, null, h(CardTitle, null, 'Project')), h(Button, null, 'Save')),
      ),
    );
    expect(markup).toContain('data-carved-theme="custom"');
    expect(markup).toContain('--carved-surface-0:');
    expect(markup).toContain('<button');
  });

  it('applies presets through the stylesheet instead of inline variables', () => {
    const markup = html(h(CarvedProvider, { theme: 'night' }, 'Content'));
    expect(markup).toContain('data-carved-theme="night"');
    expect(markup).not.toContain('--carved-surface-0');
  });

  it('renders the overlay host inside the provider', () => {
    const markup = html(h(CarvedProvider, null, 'Content'));
    expect(markup).toMatch(/class="carved-portal-host"/);
  });

  it('renders composed fields with labels and descriptions', () => {
    const markup = html(h(TextField, { label: 'Email', description: 'For receipts.' }));
    expect(markup).toContain('Email');
    expect(markup).toContain('For receipts.');
    expect(markup).toMatch(/aria-describedby="[^"]+"/);
    expect(
      html(h(Select, { label: 'Plan', children: h(SelectItem, { id: 'free' }, 'Free') })),
    ).toContain('Plan');
  });

  it('works without a provider', () => {
    expect(html(h(Button, null, 'Save'))).toContain('<button');
  });
});

describe('depth', () => {
  it('advances only at surfaces, through any wrapper, and stops at five', () => {
    let child: ReactNode = h('p', null, 'Deepest');
    for (let level = 0; level < 7; level++) child = h('section', null, h(Surface, null, child));
    const depths = [
      ...html(h(CarvedProvider, null, child)).matchAll(
        /class="carved-surface[^"]*" data-carved-depth="(\d)"/g,
      ),
    ];
    expect(depths.map((match) => Number(match[1]))).toEqual([1, 2, 3, 4, 5, 5, 5]);
  });

  it('cuts an accordion, its disclosures and an open panel a level deeper each', () => {
    const markup = html(
      h(
        Accordion,
        { defaultExpandedKeys: ['open'] },
        h(Disclosure, { id: 'open', title: 'Open' }, 'Inside'),
        h(Disclosure, { id: 'closed', title: 'Closed' }, 'Hidden'),
      ),
    );
    const depth = (name: string) =>
      [...markup.matchAll(new RegExp(`<[^>]*class="carved-${name}[ "][^>]*>`, 'g'))].map(
        ([tag]) => tag.match(/data-carved-depth="(\d)"/)?.[1],
      );
    expect(depth('accordion')).toEqual(['1']);
    expect(depth('disclosure')).toEqual(['2', '2']);
    expect(depth('disclosure-panel')).toEqual(['3', '3']);
  });

  it('accepts an explicit depth and rejects invalid ones', () => {
    expect(html(h(Surface, { depth: 3 }, 'Deep'))).toContain('data-carved-depth="3"');
    expect(() => html(h(Surface, { depth: 7 as 0 }))).toThrow(RangeError);
  });
});

describe('locale', () => {
  it('sets direction and language only when a locale is given', () => {
    expect(html(h(CarvedProvider, null, 'x'))).not.toContain('dir=');
    const arabic = html(h(CarvedProvider, { locale: 'ar-EG' }, 'x'));
    expect(arabic).toContain('dir="rtl"');
    expect(arabic).toContain('lang="ar-EG"');
  });

  it('lets nested providers inherit the locale', () => {
    const markup = html(
      h(CarvedProvider, { locale: 'he-IL' }, h(CarvedProvider, { theme: 'light' }, 'x')),
    );
    expect(markup.match(/dir="rtl"/g)).toHaveLength(2); // the outer provider and its overlay host
  });
});

describe('content', () => {
  it('keeps heading levels and engraved styling', () => {
    const markup = html(h(Heading, { level: 1, variant: 'engraved' }, 'Carved'));
    expect(markup).toMatch(/^<h1[^>]*class="carved-heading carved-engrave"/);
  });

  it('only announces alerts when asked to', () => {
    expect(html(h(Alert, null, 'Saved'))).not.toContain('role=');
    expect(html(h(Alert, { live: 'polite' }, 'Saved'))).toContain('role="status"');
    expect(html(h(Alert, { live: 'assertive', tone: 'danger' }, 'Failed'))).toContain(
      'role="alert"',
    );
  });

  it('inlays badges with their tone', () => {
    expect(html(h(Badge, { tone: 'success' }, 'Live'))).toContain('data-tone="success"');
  });

  it('requires a name for icon buttons', () => {
    expect(() => html(h(IconButton, { 'aria-label': ' ' }, 'x'))).toThrow('non-empty aria-label');
  });
});

describe('server rendering of interactive components', () => {
  it('renders dates, colours, numbers and files with their labels', () => {
    const markup = html(
      h(
        CarvedProvider,
        { locale: 'en-US' },
        h(DatePicker, { label: 'Launch', defaultValue: parseDate('2026-03-10') }),
        h(Calendar, { 'aria-label': 'Day', defaultValue: parseDate('2026-03-10') }),
        h(NumberField, { label: 'Seats', defaultValue: 4 }),
        h(ColorPicker, { label: 'Accent', defaultValue: '#1380C3' }),
        h(DropZone, { label: 'Drop images here' }),
        h(Meter, { label: 'Storage', value: 42 }),
      ),
    );
    for (const text of ['Launch', 'March 2026', 'Seats', 'Accent', 'Drop images here', 'Storage'])
      expect(markup).toContain(text);
    expect(markup).toContain('role="meter"');
  });

  it('renders collections, and a closed command palette as nothing', () => {
    const markup = html(
      h(
        CarvedProvider,
        null,
        h(
          DataTable,
          { 'aria-label': 'Deploys' },
          h(DataTableHeader, null, h(Column, { isRowHeader: true }, 'Commit')),
          h(DataTableBody, null, h(Row, null, h(Cell, null, 'a41f'))),
        ),
        h(Tree, { 'aria-label': 'Files' }, h(TreeItem, { id: 'src', title: 'src' })),
        h(TagGroup, { label: 'Labels' }, h(Tag, { id: 'bug' }, 'Bug')),
        h(CommandPalette, null, h(CommandItem, { id: 'new' }, 'New project')),
      ),
    );
    for (const text of ['Deploys', 'a41f', 'src', 'Bug']) expect(markup).toContain(text);
    expect(markup).not.toContain('New project');
  });

  it('renders keys and groups of people without React Aria', () => {
    expect(html(h(Kbd, null, '⌘K'))).toBe('<kbd class="carved-kbd carved-raise">⌘K</kbd>');
    const people = html(
      h(AvatarGroup, {
        'aria-label': 'Members',
        max: 2,
        children: ['Amara Okafor', 'Kenji Sato', 'Lena Fischer'].map((name) =>
          h(Avatar, { key: name, name }),
        ),
      }),
    );
    expect(people).toContain('aria-label="1 more"');
    expect(people.match(/role="img"/g)).toHaveLength(3);
  });
});

describe('pagination', () => {
  const pages = (page: number, pageCount: number) =>
    [...html(h(Pagination, { page, pageCount })).matchAll(/aria-label="Page (\d+)"|…/g)].map(
      (match) => match[1] ?? '…',
    );

  it('shows the ends and the neighbours of the current page', () => {
    expect(pages(6, 24)).toEqual(['1', '…', '5', '6', '7', '…', '24']);
    expect(pages(1, 24)).toEqual(['1', '2', '…', '24']);
  });

  it('never hides a single page behind an ellipsis', () => {
    expect(pages(4, 7)).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    expect(pages(1, 1)).toEqual(['1']);
  });

  it('marks the current page and turns pages into links when given URLs', () => {
    const markup = html(h(Pagination, { page: 2, pageCount: 3, href: (page) => `?page=${page}` }));
    expect(markup).toMatch(
      /aria-label="Page 2"[^>]*aria-current="page"|aria-current="page"[^>]*aria-label="Page 2"/,
    );
    expect(markup).toContain('href="?page=3"');
  });
});
