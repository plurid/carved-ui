import {
  Button,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  Disclosure,
  DropZone,
  FileItem,
  FileList,
  Heading,
  Tag,
  TagGroup,
} from '@plurid/carved-ui-react';
import { useTimes } from '../shared/time';
import type { Upload } from '../shared/uploads';
import { Thumbnail } from './files-view';
import type { Entry } from './data';

const colours = ['#8a96a3', '#c46a52', '#d6a441', '#5f946d', '#4f80b8', '#8d6fbd'];

interface DetailsProps {
  /** The folder shown, or the place's name. */
  folder: Entry | null;
  place: string;
  /** What is chosen in the folder. */
  chosen: Entry[];
  total: number;
  location: (entry: Entry) => string;
  formatSize: (bytes: number) => string;
  onColor: (folder: Entry, color: string) => void;
  onTags: (entry: Entry, tags: string[]) => void;
  uploads: Upload[];
  onUpload: (files: File[]) => void;
  onRemoveUpload: (id: string) => void;
  onClearUploads: () => void;
}

/** What is chosen, or the folder itself: its facts, its colour, and a place to upload to it. */
export function Details({
  folder,
  place,
  chosen,
  total,
  location,
  formatSize,
  onColor,
  onTags,
  uploads,
  onUpload,
  onRemoveUpload,
  onClearUploads,
}: DetailsProps) {
  const times = useTimes();
  const [entry] = chosen;

  if (chosen.length === 1 && entry)
    return (
      <aside className="strata-details" aria-labelledby="strata-details-title">
        <Thumbnail entry={entry} />
        <Heading level={2} id="strata-details-title" className="strata-details-title">
          {entry.name}
        </Heading>
        <dl className="strata-facts">
          <div>
            <dt>Kind</dt>
            <dd>
              {entry.kind === 'sheet'
                ? 'Spreadsheet'
                : entry.kind[0]!.toUpperCase() + entry.kind.slice(1)}
            </dd>
          </div>
          {entry.kind !== 'folder' && (
            <div>
              <dt>Size</dt>
              <dd>{formatSize(entry.size)}</dd>
            </div>
          )}
          <div>
            <dt>Changed</dt>
            <dd>{times.full(entry.modified)}</dd>
          </div>
          <div>
            <dt>Owner</dt>
            <dd>{entry.owner}</dd>
          </div>
        </dl>
        <Disclosure title="Where it is" headingLevel={3}>
          <p className="strata-muted">{location(entry)}</p>
        </Disclosure>
        <TagGroup
          label="Tags"
          onRemove={(keys) =>
            onTags(
              entry,
              entry.tags.filter((tag) => !keys.has(tag)),
            )
          }
          renderEmptyState={() => <span className="strata-muted">No tags.</span>}
        >
          {entry.tags.map((tag) => (
            <Tag key={tag} id={tag}>
              {tag}
            </Tag>
          ))}
        </TagGroup>
        <div className="row">
          {['Work', 'Personal', 'Keep'].map(
            (tag) =>
              !entry.tags.includes(tag) && (
                <Button
                  key={tag}
                  variant="ghost"
                  size="sm"
                  onPress={() => onTags(entry, [...entry.tags, tag])}
                >
                  + {tag}
                </Button>
              ),
          )}
        </div>
      </aside>
    );

  return (
    <aside className="strata-details" aria-labelledby="strata-details-title">
      <Heading level={2} id="strata-details-title" className="strata-details-title">
        {chosen.length > 1 ? `${chosen.length} chosen` : (folder?.name ?? place)}
      </Heading>
      <p className="strata-muted">
        {chosen.length > 1
          ? formatSize(chosen.reduce((sum, item) => sum + item.size, 0))
          : `${total} ${total === 1 ? 'item' : 'items'}`}
      </p>
      {folder && chosen.length === 0 && (
        <ColorSwatchPicker
          aria-label="Folder colour"
          value={folder.color ?? colours[0]}
          onChange={(color) => onColor(folder, color.toString('hex'))}
          className="strata-colours"
        >
          {colours.map((colour) => (
            <ColorSwatchPickerItem key={colour} color={colour} />
          ))}
        </ColorSwatchPicker>
      )}
      {folder && (
        <DropZone
          label={`Upload to ${folder.name}`}
          description="Drop files here, or choose them."
          allowsMultiple
          onSelect={onUpload}
        />
      )}
      {uploads.length > 0 && (
        <>
          <FileList aria-label="Uploads">
            {uploads.map((upload) => (
              <FileItem
                key={upload.id}
                file={upload.file}
                progress={upload.progress < 100 ? upload.progress : undefined}
                error={upload.error}
                onRemove={() => onRemoveUpload(upload.id)}
              />
            ))}
          </FileList>
          <Button variant="ghost" size="sm" onPress={onClearUploads}>
            Clear the list
          </Button>
        </>
      )}
    </aside>
  );
}
