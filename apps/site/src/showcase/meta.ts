import { labels, mailboxes } from './post/places';
import { consolePages } from './quarry/places';
import { drivePlaces } from './strata/places';

/**
 * The showcase: three applications built with Carved. This module holds only their names and
 * paths, so the site lists and prerenders them without loading them.
 */
export interface ShowcaseApp {
  /** The path of the app's first page. */
  path: string;
  name: string;
  kind: string;
  summary: string;
  /** What it is built from, to show on its card. */
  highlights: string[];
  /** Its source in the repository. */
  source: string;
  /** Every page of the app, with its title. */
  pages: { path: string; title: string }[];
}

const source = 'https://github.com/plurid/carved-ui/tree/master/apps/site/src/showcase';

export const showcase: ShowcaseApp[] = [
  {
    path: '/showcase/mail',
    name: 'Post',
    kind: 'Mail',
    summary:
      'Five thousand messages in a split view: filter them as you type, read, reply, label, archive and compose.',
    highlights: ['AppShell', 'SplitView', 'Autocomplete', 'Virtualizer', 'GridList', 'Toolbar'],
    source: `${source}/post`,
    pages: [
      ...mailboxes.map((box) => ({
        path: box.slug === 'inbox' ? '/showcase/mail' : `/showcase/mail/${box.slug}`,
        title: `${box.name} · Post`,
      })),
      ...labels.map((label) => ({
        path: `/showcase/mail/labels/${label.slug}`,
        title: `${label.name} · Post`,
      })),
    ],
  },
  {
    path: '/showcase/console',
    name: 'Quarry',
    kind: 'Deploy console',
    summary:
      'Usage, a chart of deploys, ten thousand deploys to sort and filter, rollbacks, settings and a command palette.',
    highlights: [
      'DataTable',
      'Virtualizer',
      'Meter',
      'DateRangePicker',
      'CommandPalette',
      'Drawer',
    ],
    source: `${source}/quarry`,
    pages: consolePages.map((page) => ({
      path: page.slug === 'overview' ? '/showcase/console' : `/showcase/console/${page.slug}`,
      title: `${page.name} · Quarry`,
    })),
  },
  {
    path: '/showcase/files',
    name: 'Strata',
    kind: 'Drive',
    summary:
      'Folders in nested wells, two thousand photos in a grid, uploads with progress, and the details of each file.',
    highlights: ['Tree', 'Breadcrumbs', 'GridList', 'Virtualizer', 'DropZone', 'FileList'],
    source: `${source}/strata`,
    pages: drivePlaces.map((place) => ({
      path: place.slug === 'files' ? '/showcase/files' : `/showcase/files/${place.slug}`,
      title: `${place.name} · Strata`,
    })),
  },
];

export const showcasePages = showcase.flatMap((app) => app.pages);
