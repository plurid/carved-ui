import { between, NOW, people, pick, seeded } from '../shared/random';
import type { Random } from '../shared/random';

export type Kind = 'folder' | 'photo' | 'document' | 'sheet' | 'video';

export interface Entry {
  id: string;
  name: string;
  kind: Kind;
  /** The folder it is in; `null` at the top of My files. */
  parent: string | null;
  /** In bytes; folders count their contents instead. */
  size: number;
  /** When it last changed, in milliseconds since 1970 (UTC). */
  modified: number;
  owner: string;
  /** A photo's colours, as a hue. */
  hue?: number;
  /** A folder's colour, if one was chosen. */
  color?: string;
  tags: string[];
  /** Where it is: in My files, shared with you, or in the trash. */
  place: 'files' | 'shared' | 'trash';
}

export const me = 'Kenji Sato';

/** The folders of My files, as `[id, name, parent]`. */
const folders: [string, string, string | null][] = [
  ['projects', 'Projects', null],
  ['atlas', 'Atlas', 'projects'],
  ['atlas-designs', 'Designs', 'atlas'],
  ['atlas-notes', 'Notes', 'atlas'],
  ['basalt', 'Basalt', 'projects'],
  ['photos', 'Photos', null],
  ['camera', 'Camera roll', 'photos'],
  ['lisbon', 'Lisbon, autumn', 'photos'],
  ['kyoto', 'Kyoto, spring', 'photos'],
  ['documents', 'Documents', null],
  ['invoices', 'Invoices', 'documents'],
  ['contracts', 'Contracts', 'documents'],
];

const documentNames = [
  'Brief',
  'Research notes',
  'Interview plan',
  'Roadmap',
  'Meeting notes',
  'Launch checklist',
  'Style guide',
  'Retrospective',
];

function photo(random: Random, id: string, name: string, parent: string, at: number): Entry {
  return {
    id,
    name,
    kind: 'photo',
    parent,
    size: between(random, 1_800_000, 6_400_000),
    modified: at,
    owner: me,
    hue: between(random, 0, 359),
    tags: [],
    place: 'files',
  };
}

function photos(random: Random, parent: string, count: number, prefix: string, from: number) {
  let at = from;
  return Array.from({ length: count }, (_, index) => {
    at -= between(random, 20, 600) * 60_000;
    const number = String(count - index).padStart(4, '0');
    return photo(random, `${parent}-${number}`, `${prefix}${number}.jpg`, parent, at);
  });
}

function documents(random: Random, parent: string, names: string[], kind: Kind, extension: string) {
  let at = NOW - between(random, 1, 30) * 3_600_000;
  return names.map((name, index): Entry => {
    at -= between(random, 2, 80) * 3_600_000;
    return {
      id: `${parent}-${index}`,
      name: `${name}.${extension}`,
      kind,
      parent,
      size: between(random, 24_000, 2_400_000),
      modified: at,
      owner: random() < 0.7 ? me : pick(random, people),
      tags: random() < 0.3 ? ['Work'] : [],
      place: 'files',
    };
  });
}

/** Everything in the drive, the same every time. */
export function createDrive(): Entry[] {
  const random = seeded(4242);
  const folderEntries = folders.map(([id, name, parent], index): Entry => ({
    id,
    name,
    kind: 'folder',
    parent,
    size: 0,
    modified: NOW - (index + 1) * 5_400_000,
    owner: me,
    tags: [],
    place: 'files',
  }));
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
  const shared = Array.from({ length: 24 }, (_, index): Entry => {
    const owner = pick(
      random,
      people.filter((person) => person !== me),
    );
    const kind = pick(random, ['document', 'sheet', 'photo', 'video'] as const);
    return {
      id: `shared-${index}`,
      name:
        kind === 'photo'
          ? `From ${owner.split(' ')[0]} ${index + 1}.jpg`
          : kind === 'video'
            ? `Walkthrough ${index + 1}.mp4`
            : kind === 'sheet'
              ? `${pick(random, ['Budget', 'Headcount', 'Pricing'])} ${2026 - (index % 2)}.xlsx`
              : `${pick(random, documentNames)} (${owner.split(' ')[0]}).pdf`,
      kind,
      parent: null,
      size: between(random, 40_000, 90_000_000),
      modified: NOW - between(random, 1, 900) * 3_600_000,
      owner,
      hue: between(random, 0, 359),
      tags: [],
      place: 'shared',
    };
  });
  return [
    ...folderEntries,
    ...photos(random, 'camera', 2000, 'IMG_', NOW - 40 * 60_000),
    ...photos(random, 'lisbon', 48, 'Lisbon ', NOW - 120 * 86_400_000),
    ...photos(random, 'kyoto', 64, 'Kyoto ', NOW - 300 * 86_400_000),
    ...photos(random, 'atlas-designs', 18, 'Screen ', NOW - 2 * 86_400_000),
    ...documents(random, 'atlas-notes', documentNames, 'document', 'md'),
    ...documents(random, 'basalt', documentNames.slice(0, 4), 'document', 'pdf'),
    ...documents(
      random,
      'invoices',
      months.map((month) => `Invoice ${month}`),
      'document',
      'pdf',
    ),
    ...documents(random, 'contracts', ['Lease', 'Employment', 'Supplier'], 'document', 'pdf'),
    ...documents(random, 'documents', ['Budget 2026', 'Travel expenses'], 'sheet', 'xlsx'),
    ...shared,
    ...documents(random, 'trash', ['Old draft', 'Copy of brief'], 'document', 'md').map(
      (entry) => ({ ...entry, parent: null, place: 'trash' as const }),
    ),
  ];
}

/** The folders from the top of My files down to `id`. */
export function pathTo(entries: Entry[], id: string | null) {
  const path: Entry[] = [];
  let current = id ? entries.find((entry) => entry.id === id) : undefined;
  while (current) {
    path.unshift(current);
    current = current.parent ? entries.find((entry) => entry.id === current!.parent) : undefined;
  }
  return path;
}
