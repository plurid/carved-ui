import {
  GridLayout,
  GridList,
  GridListItem,
  LayoutSize,
  ListLayout,
  Virtualizer,
} from '@plurid/carved-ui-react';
import type { Selection } from '@plurid/carved-ui-react';
import { DocumentIcon, FolderIcon } from '../shared/icons';
import { useTimes } from '../shared/time';
import type { Entry } from './data';

interface FilesViewProps {
  label: string;
  entries: Entry[];
  view: 'grid' | 'list';
  /** How many entries each folder holds. */
  counts: Map<string, number>;
  selected: Selection;
  onSelectionChange: (selection: Selection) => void;
  onOpenFolder: (id: string) => void;
  formatSize: (bytes: number) => string;
}

const tiles = { minItemSize: new LayoutSize(150, 150), minSpace: new LayoutSize(12, 12) };

/** A small picture of an entry: a photo's colours, or its kind's icon. */
export function Thumbnail({ entry }: { entry: Entry }) {
  return (
    <span
      className="strata-thumb"
      data-kind={entry.kind}
      style={
        {
          '--_hue': entry.hue ?? 210,
          '--_folder': entry.color,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {entry.kind === 'folder' ? (
        <FolderIcon width={30} height={30} />
      ) : entry.kind === 'photo' ? null : (
        <DocumentIcon width={28} height={28} />
      )}
    </span>
  );
}

/**
 * A folder's contents as tiles or rows, virtualized either way. Clicking chooses an entry, ⌘ or
 * Shift add to the choice, and a double click or Enter opens a folder.
 */
export function FilesView({
  label,
  entries,
  view,
  counts,
  selected,
  onSelectionChange,
  onOpenFolder,
  formatSize,
}: FilesViewProps) {
  const times = useTimes();
  const describe = (entry: Entry) =>
    entry.kind === 'folder'
      ? `${counts.get(entry.id) ?? 0} items`
      : view === 'grid'
        ? formatSize(entry.size)
        : `${formatSize(entry.size)} · ${times.short(entry.modified)}`;
  const list = (
    <GridList
      aria-label={label}
      layout={view === 'grid' ? 'grid' : 'stack'}
      items={entries}
      selectionMode="multiple"
      selectionBehavior="replace"
      selectedKeys={selected}
      onSelectionChange={onSelectionChange}
      onAction={(key) => {
        const entry = entries.find((item) => item.id === key);
        if (entry?.kind === 'folder') onOpenFolder(entry.id);
      }}
      renderEmptyState={() => (
        <div className="strata-empty">
          <p>Nothing here yet.</p>
          <p className="strata-muted">Drop files on the details panel, or use Upload.</p>
        </div>
      )}
      className={view === 'grid' ? 'strata-files strata-tiles' : 'strata-files strata-rows'}
    >
      {(entry) => (
        <GridListItem id={entry.id} textValue={entry.name} className="strata-item">
          <Thumbnail entry={entry} />
          <span className="strata-item-text">
            <span className="strata-item-name">{entry.name}</span>
            <span className="strata-item-meta">{describe(entry)}</span>
          </span>
        </GridListItem>
      )}
    </GridList>
  );
  // The two views lay out the same list differently, each virtualized.
  return view === 'grid' ? (
    <Virtualizer key="grid" layout={GridLayout} layoutOptions={tiles}>
      {list}
    </Virtualizer>
  ) : (
    <Virtualizer key="list" layout={ListLayout} layoutOptions={{ estimatedRowSize: 56 }}>
      {list}
    </Virtualizer>
  );
}
