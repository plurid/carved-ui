import { useMemo, useState } from 'react';
import type { ThemePreset } from '@plurid/carved-ui-core';
import {
  AlertDialog,
  AppShell,
  Avatar,
  Breadcrumb,
  Breadcrumbs,
  Button,
  DialogTrigger,
  FileTrigger,
  Heading,
  IconButton,
  Menu,
  MenuItem,
  MenuTrigger,
  Meter,
  Modal,
  Sidebar,
  SidebarItem,
  SidebarSection,
  SplitPane,
  SplitView,
  ToastQueue,
  ToastRegion,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  TooltipTrigger,
  Tree,
  TreeItem,
  useLocale,
} from '@plurid/carved-ui-react';
import type { Key, Selection } from '@plurid/carved-ui-react';
import { ThemeMenu } from '../shared/theme-menu';
import {
  ClockIcon,
  DownloadIcon,
  FolderIcon,
  GridIcon,
  ListIcon,
  TrashIcon,
  UsersIcon,
} from '../shared/icons';
import { NOW } from '../shared/random';
import { useUploads } from '../shared/uploads';
import { createDrive, me, pathTo } from './data';
import type { Entry, Kind } from './data';
import { Details } from './details';
import { FilesView } from './files-view';
import { drivePlaces } from './places';
import type { DrivePlace } from './places';

export interface StrataProps {
  place: DrivePlace;
  /** The path the app is served at: places are its subpaths. */
  base: string;
  /** Goes to a path, through the host's router. */
  navigate: (href: string) => void;
  /** Where "All apps" goes. */
  exitHref: string;
  theme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
}

const toasts = new ToastQueue({ maxVisibleToasts: 3 });
const icons = { files: FolderIcon, shared: UsersIcon, recent: ClockIcon, trash: TrashIcon };

const kindOf = (file: File): Kind =>
  file.type.startsWith('image/')
    ? 'photo'
    : file.type.startsWith('video/')
      ? 'video'
      : /sheet|excel|csv/.test(file.type)
        ? 'sheet'
        : 'document';

/** Folders first, then by name as people read it. */
const order = (collator: Intl.Collator) => (a: Entry, b: Entry) =>
  Number(b.kind === 'folder') - Number(a.kind === 'folder') || collator.compare(a.name, b.name);

/**
 * Strata, a drive: folders in nested wells beside their contents, two thousand photos in a
 * virtualized grid, uploads with progress, and the details of whatever is chosen.
 */
export function Strata({ place, base, navigate, exitHref, theme, onThemeChange }: StrataProps) {
  const { locale } = useLocale();
  const [entries, setEntries] = useState(createDrive);
  const [folderId, setFolderId] = useState<string | null>('camera');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Selection>(new Set());
  const [expanded, setExpanded] = useState<Set<Key>>(new Set(['root', 'photos']));
  const uploads = useUploads();

  const collator = useMemo(() => new Intl.Collator(locale, { numeric: true }), [locale]);
  const size = useMemo(() => {
    const format = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    return (bytes: number) =>
      bytes >= 1e9
        ? `${format.format(bytes / 1e9)} GB`
        : bytes >= 1e6
          ? `${format.format(bytes / 1e6)} MB`
          : `${format.format(Math.max(bytes / 1e3, 1))} kB`;
  }, [locale]);

  const folder =
    place === 'files' ? (entries.find((entry) => entry.id === folderId) ?? null) : null;
  const path = pathTo(entries, place === 'files' ? folderId : null);
  const placeName = drivePlaces.find((item) => item.slug === place)!.name;

  const counts = useMemo(() => {
    const totals = new Map<string, number>();
    for (const entry of entries)
      if (entry.parent && entry.place === 'files')
        totals.set(entry.parent, (totals.get(entry.parent) ?? 0) + 1);
    return totals;
  }, [entries]);

  const shown = useMemo(() => {
    if (place === 'files')
      return entries
        .filter((entry) => entry.place === 'files' && entry.parent === folderId)
        .sort(order(collator));
    if (place === 'recent')
      return entries
        .filter((entry) => entry.place === 'files' && entry.kind !== 'folder')
        .sort((a, b) => b.modified - a.modified)
        .slice(0, 60);
    return entries.filter((entry) => entry.place === place).sort(order(collator));
  }, [entries, place, folderId, collator]);

  const chosen =
    selected === 'all' ? shown : shown.filter((entry) => (selected as Set<Key>).has(entry.id));

  // A new folder or place starts with nothing chosen, and its folders open in the tree.
  const [showing, setShowing] = useState(`${place}:${folderId}`);
  if (showing !== `${place}:${folderId}`) {
    setShowing(`${place}:${folderId}`);
    setSelected(new Set());
    const opened = path.map((entry) => entry.id).filter((id) => !expanded.has(id));
    if (opened.length) setExpanded(new Set([...expanded, 'root', ...opened]));
  }

  const openFolder = (id: string | null) => {
    setFolderId(id);
    if (place !== 'files') navigate(base);
  };

  const update = (ids: Set<string>, change: (entry: Entry) => Entry) =>
    setEntries((all) => all.map((entry) => (ids.has(entry.id) ? change(entry) : entry)));

  const remove = () => {
    const ids = new Set(chosen.map((entry) => entry.id));
    const places = new Map(chosen.map((entry) => [entry.id, entry.place]));
    update(ids, (entry) => ({ ...entry, place: 'trash' }));
    setSelected(new Set());
    toasts.add(
      {
        title: `Moved ${ids.size === 1 ? chosen[0]!.name : `${ids.size} items`} to the trash`,
        action: {
          label: 'Undo',
          onAction: () => update(ids, (entry) => ({ ...entry, place: places.get(entry.id)! })),
        },
      },
      { timeout: 6000 },
    );
  };

  const moveTo = (target: string) => {
    const ids = new Set(chosen.map((entry) => entry.id).filter((id) => id !== target));
    update(ids, (entry) => ({ ...entry, parent: target, place: 'files' }));
    setSelected(new Set());
    toasts.add(
      { title: `Moved to ${entries.find((entry) => entry.id === target)!.name}` },
      { timeout: 4000 },
    );
  };

  const upload = (files: File[]) => {
    const target = place === 'files' ? folderId : null;
    uploads.add(files);
    setEntries((all) => [
      ...all,
      ...files.map((file, index): Entry => ({
        id: `upload-${all.length + index}-${file.name}`,
        name: file.name,
        kind: kindOf(file),
        parent: target,
        size: file.size,
        modified: NOW,
        owner: me,
        hue: (file.name.length * 47) % 360,
        tags: [],
        place: 'files',
      })),
    ]);
  };

  const folderItems = (parent: string | null): React.ReactNode =>
    entries
      .filter(
        (entry) => entry.kind === 'folder' && entry.place === 'files' && entry.parent === parent,
      )
      .sort(order(collator))
      .map((entry) => (
        <TreeItem
          key={entry.id}
          id={entry.id}
          textValue={entry.name}
          title={
            <span className="strata-tree-title">
              <FolderIcon style={{ color: entry.color }} />
              {entry.name}
            </span>
          }
        >
          {folderItems(entry.id)}
        </TreeItem>
      ));

  const moveTargets = entries.filter(
    (entry) => entry.kind === 'folder' && entry.place === 'files' && entry.id !== folderId,
  );

  return (
    <>
      <AppShell
        className="strata"
        header={
          <>
            <span className="strata-brand carved-engrave">Strata</span>
            <FileTrigger allowsMultiple onSelect={(files) => files && upload([...files])}>
              <Button size="sm">Upload</Button>
            </FileTrigger>
            <ThemeMenu theme={theme} onThemeChange={onThemeChange} />
            <Avatar name={me} size="sm" />
          </>
        }
        sidebar={
          <Sidebar aria-label="Drive">
            <SidebarSection>
              {drivePlaces.map((item) => {
                const Icon = icons[item.slug];
                const trash = entries.filter((entry) => entry.place === 'trash').length;
                return (
                  <SidebarItem
                    key={item.slug}
                    href={item.slug === 'files' ? base : `${base}/${item.slug}`}
                    icon={<Icon />}
                    isCurrent={place === item.slug}
                    count={item.slug === 'trash' && trash ? trash : undefined}
                  >
                    {item.name}
                  </SidebarItem>
                );
              })}
            </SidebarSection>
            <Meter
              label="Storage"
              value={74}
              valueLabel="74 of 100 GB"
              className="strata-storage"
            />
            <SidebarSection className="strata-exit">
              <SidebarItem href={exitHref} icon={<GridIcon />}>
                All apps
              </SidebarItem>
            </SidebarSection>
          </Sidebar>
        }
      >
        <div className="strata-main">
          <SplitView
            defaultSize={24}
            minSize={16}
            maxSize={40}
            collapsible
            handleLabel="Resize the folders"
            className="strata-split"
          >
            <SplitPane>
              <Tree
                aria-label="Folders"
                selectionMode="single"
                selectionBehavior="replace"
                disallowEmptySelection
                selectedKeys={place === 'files' ? [folderId ?? 'root'] : []}
                onSelectionChange={(keys) => {
                  const [key] = keys === 'all' ? [] : [...keys];
                  if (key !== undefined) openFolder(key === 'root' ? null : String(key));
                }}
                expandedKeys={expanded}
                onExpandedChange={setExpanded}
                className="strata-tree"
              >
                <TreeItem
                  id="root"
                  textValue="My files"
                  title={
                    <span className="strata-tree-title">
                      <FolderIcon />
                      My files
                    </span>
                  }
                >
                  {folderItems(null)}
                </TreeItem>
              </Tree>
            </SplitPane>
            <SplitPane className="strata-content">
              <div className="strata-head">
                <div className="strata-heading">
                  <Heading level={1} className="strata-title">
                    {folder?.name ?? placeName}
                  </Heading>
                  {place === 'files' && (
                    <Breadcrumbs
                      onAction={(key) => openFolder(key === 'root' ? null : String(key))}
                    >
                      <Breadcrumb id="root">My files</Breadcrumb>
                      {path.map((entry) => (
                        <Breadcrumb key={entry.id} id={entry.id}>
                          {entry.name}
                        </Breadcrumb>
                      ))}
                    </Breadcrumbs>
                  )}
                </div>
                <ToggleButtonGroup
                  aria-label="View"
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={[view]}
                  onSelectionChange={(keys) => setView([...keys][0] as 'grid' | 'list')}
                >
                  <ToggleButton id="grid" aria-label="Tiles" size="sm">
                    <GridIcon />
                  </ToggleButton>
                  <ToggleButton id="list" aria-label="List" size="sm">
                    <ListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              {chosen.length > 0 && (
                <Toolbar aria-label="Chosen" className="strata-selection">
                  <span className="strata-count" aria-live="polite">
                    {chosen.length} chosen
                  </span>
                  <TooltipTrigger>
                    <IconButton
                      aria-label="Download"
                      onPress={() =>
                        toasts.add(
                          {
                            title: `Preparing ${chosen.length === 1 ? chosen[0]!.name : `${chosen.length} files`}`,
                            description: 'This is a showcase: nothing downloads.',
                          },
                          { timeout: 4000 },
                        )
                      }
                    >
                      <DownloadIcon />
                    </IconButton>
                    <Tooltip>Download</Tooltip>
                  </TooltipTrigger>
                  <MenuTrigger>
                    <Button variant="ghost" size="sm">
                      Move to
                    </Button>
                    <Menu aria-label="Move to" onAction={(key) => moveTo(String(key))}>
                      {moveTargets.map((target) => (
                        <MenuItem key={target.id} id={target.id}>
                          {target.name}
                        </MenuItem>
                      ))}
                    </Menu>
                  </MenuTrigger>
                  {place !== 'trash' && (
                    <DialogTrigger>
                      <TooltipTrigger>
                        <IconButton aria-label="Move to the trash">
                          <TrashIcon />
                        </IconButton>
                        <Tooltip>Move to the trash</Tooltip>
                      </TooltipTrigger>
                      <Modal size="sm">
                        <AlertDialog
                          title={`Move ${chosen.length === 1 ? 'it' : `${chosen.length} items`} to the trash?`}
                          actionLabel="Move to the trash"
                          onAction={remove}
                        >
                          You can bring {chosen.length === 1 ? 'it' : 'them'} back from the trash
                          for 30 days.
                        </AlertDialog>
                      </Modal>
                    </DialogTrigger>
                  )}
                  <Button variant="ghost" size="sm" onPress={() => setSelected(new Set())}>
                    Clear
                  </Button>
                </Toolbar>
              )}
              <div className="strata-body">
                <FilesView
                  label={folder?.name ?? placeName}
                  entries={shown}
                  view={view}
                  counts={counts}
                  selected={selected}
                  onSelectionChange={setSelected}
                  onOpenFolder={openFolder}
                  formatSize={size}
                />
                <Details
                  folder={folder}
                  place={placeName}
                  chosen={chosen}
                  total={shown.length}
                  location={(entry) =>
                    entry.place === 'trash'
                      ? 'In the trash'
                      : entry.place === 'shared'
                        ? `Shared with you by ${entry.owner}`
                        : [
                            'My files',
                            ...pathTo(entries, entry.parent).map((item) => item.name),
                          ].join(' › ')
                  }
                  formatSize={size}
                  onColor={(target, color) =>
                    update(new Set([target.id]), (entry) => ({ ...entry, color }))
                  }
                  onTags={(target, tags) =>
                    update(new Set([target.id]), (entry) => ({ ...entry, tags }))
                  }
                  uploads={uploads.uploads}
                  onUpload={upload}
                  onRemoveUpload={uploads.remove}
                  onClearUploads={uploads.clear}
                />
              </div>
            </SplitPane>
          </SplitView>
        </div>
      </AppShell>
      <ToastRegion queue={toasts} />
    </>
  );
}
