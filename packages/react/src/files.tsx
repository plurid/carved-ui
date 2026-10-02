'use client';
import { DropZone as AriaDropZone } from 'react-aria-components/DropZone';
import type { DropZoneProps as AriaDropZoneProps } from 'react-aria-components/DropZone';
import { FileTrigger as AriaFileTrigger } from 'react-aria-components/FileTrigger';
import { ProgressBar as AriaProgressBar } from 'react-aria-components/ProgressBar';
import { Text } from 'react-aria-components/Text';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import type { FileDropItem } from 'react-aria-components';
import { useNumberFormatter } from 'react-aria/useNumberFormatter';
import type { ComponentProps, ReactNode, Ref } from 'react';
import { Button, IconButton } from './actions.js';
import { DepthScope, useCutDepth } from './provider.js';
import { cx, withClass } from './internal/class-names.js';
import { Close, FileIcon, Upload } from './internal/icons.js';

/** Opens the system file browser when its child, such as a `Button`, is pressed. */
export const FileTrigger = AriaFileTrigger;

/** Accepted types, trimmed and lower-cased once, so dragging and dropping agree. */
function normalise(types: readonly string[] | undefined): string[] {
  return (types ?? []).map((type) => type.trim().toLowerCase()).filter(Boolean);
}

/** Whether a file matches MIME types (`image/png`, `image/*`) or extensions (`.pdf`). */
function accepts(file: File, types: string[]) {
  if (!types.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return types.some((accepted) => {
    if (accepted.startsWith('.')) return name.endsWith(accepted);
    if (accepted.endsWith('/*')) return type.startsWith(accepted.slice(0, -1));
    return type === accepted;
  });
}

export interface DropZoneProps extends Omit<
  AriaDropZoneProps,
  'children' | 'onDrop' | 'getDropOperation' | 'onSelect'
> {
  /** What to drop, shown in the zone and naming it. @default 'Drop files here' */
  label?: ReactNode;
  /** A hint below the label, such as accepted types and sizes. */
  description?: ReactNode;
  /** The label of the button that opens the file browser. @default 'Choose files' */
  buttonLabel?: string;
  /**
   * MIME types, such as `image/png` or `image/*`, or extensions such as `.pdf`. Files of other
   * types are left out.
   */
  acceptedFileTypes?: string[];
  /** Accept several files at once. Otherwise only the first is kept. @default false */
  allowsMultiple?: boolean;
  /** Receives the files that were dropped, pasted or chosen, and accepted. */
  onSelect?: (files: File[]) => void;
  /**
   * Receives the files that were left out: those of other types, and any beyond the first
   * when `allowsMultiple` is off. Use it to say why.
   */
  onReject?: (files: File[]) => void;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A well that takes files: drop them in, paste them, or choose them with its button. While
 * files are dragged over it, the well cuts deeper and is lit. Show the chosen files with a
 * `FileList`.
 */
export function DropZone({
  label = 'Drop files here',
  description,
  buttonLabel = 'Choose files',
  acceptedFileTypes,
  allowsMultiple = false,
  onSelect,
  onReject,
  className,
  style,
  ...props
}: DropZoneProps) {
  const depth = useCutDepth();
  const types = normalise(acceptedFileTypes);
  const select = (files: File[]) => {
    const matching = files.filter((file) => accepts(file, types));
    const kept = allowsMultiple ? matching : matching.slice(0, 1);
    const left = files.filter((file) => !kept.includes(file));
    if (kept.length) onSelect?.(kept);
    if (left.length) onReject?.(left);
  };
  return (
    <AriaDropZone
      {...props}
      getDropOperation={(dragged) => {
        // While dragging, only MIME types are known; extensions are checked on drop.
        const known = types.filter((type) => type.includes('/'));
        const onlyKnown = known.length > 0 && known.length === types.length;
        return onlyKnown && !dragged.has(known) ? 'cancel' : 'copy';
      }}
      onDrop={async (event) => {
        const files = event.items.filter((item): item is FileDropItem => item.kind === 'file');
        select(await Promise.all(files.map((item) => item.getFile())));
      }}
      data-carved-depth={depth}
      // Lit, the zone's floor lifts toward the surface it is cut into.
      style={composeRenderProps(style, (value) => ({
        '--_above': `var(--carved-surface-${Math.max(depth - 1, 0)})`,
        ...value,
      }))}
      className={withClass('carved-drop-zone carved-carve', className)}
    >
      <DepthScope depth={depth}>
        <Upload className="carved-drop-zone-icon" />
        <Text slot="label" className="carved-drop-zone-label">
          {label}
        </Text>
        {description && <span className="carved-drop-zone-description">{description}</span>}
        <AriaFileTrigger
          acceptedFileTypes={types}
          allowsMultiple={allowsMultiple}
          onSelect={(list) => select(list ? Array.from(list) : [])}
        >
          <Button variant="secondary" size="sm" isDisabled={props.isDisabled}>
            {buttonLabel}
          </Button>
        </AriaFileTrigger>
      </DepthScope>
    </AriaDropZone>
  );
}

export interface FileListProps extends ComponentProps<'ul'> {
  /** Names the list, such as "Chosen files". */
  'aria-label': string;
}

/** The files chosen in a `DropZone`, in a well of their own: one `FileItem` each. */
export function FileList({ className, children, ...props }: FileListProps) {
  const depth = useCutDepth();
  return (
    <ul
      {...props}
      data-carved-depth={depth}
      className={cx('carved-file-list carved-carve', className)}
    >
      <DepthScope depth={depth}>{children}</DepthScope>
    </ul>
  );
}

/** A file, or what is known of one, such as an upload already on the server. */
export interface FileDescription {
  name: string;
  /** In bytes. */
  size: number;
  type?: string;
}

export interface FileItemProps extends Omit<ComponentProps<'li'>, 'children'> {
  /** The file: a `File`, or its name, size and type. */
  file: FileDescription;
  /**
   * Upload progress, 0–100. While it is set, the row fills with the accent's wash from its
   * start, and a progress bar named after the file reports it.
   */
  progress?: number;
  /** Why the file was refused or failed, shown in place of its size. */
  error?: ReactNode;
  /** Shows a button that removes the file. */
  onRemove?: () => void;
  /** Names the remove button. @default (name) => `Remove ${name}` */
  removeLabel?: (name: string) => string;
}

const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;

/**
 * A file's size in the largest unit that keeps it at or above one, formatted for the locale.
 * Units are decimal (a kilobyte is 1000 bytes), as their short names, kB and MB, say.
 */
function useFileSize(bytes: number): string {
  const step = Math.min(Math.floor(Math.log10(Math.max(bytes, 1)) / 3), units.length - 1);
  const format = useNumberFormatter({
    style: 'unit',
    unit: units[step],
    unitDisplay: 'short',
    maximumFractionDigits: step > 1 ? 1 : 0,
  });
  return format.format(bytes / 1000 ** step);
}

/** One file of a `FileList`: its name, size or error, upload progress, and a remove button. */
export function FileItem({
  file,
  progress,
  error,
  onRemove,
  removeLabel = (name) => `Remove ${name}`,
  className,
  ...props
}: FileItemProps) {
  const size = useFileSize(file.size);
  // Long names keep their extension: the stem is what gets cut short.
  const dot = file.name.lastIndexOf('.');
  const stem = dot > 0 ? file.name.slice(0, dot) : file.name;
  const extension = dot > 0 ? file.name.slice(dot) : '';
  const uploading = progress !== undefined;
  return (
    <li {...props} data-invalid={error ? true : undefined} className={cx('carved-file', className)}>
      {uploading && (
        <AriaProgressBar value={progress} aria-label={file.name} className="carved-file-progress">
          {({ percentage }) => (
            <span className="carved-file-wash" style={{ inlineSize: `${percentage ?? 0}%` }} />
          )}
        </AriaProgressBar>
      )}
      <FileIcon className="carved-file-icon" />
      <span className="carved-file-body">
        <span className="carved-file-name" title={file.name}>
          <span className="carved-file-stem">{stem}</span>
          {extension}
        </span>
        <span className="carved-file-meta">
          {error ?? (uploading ? `${size} · ${Math.round(progress)}%` : size)}
        </span>
      </span>
      {onRemove && (
        <IconButton size="sm" aria-label={removeLabel(file.name)} onPress={onRemove}>
          <Close />
        </IconButton>
      )}
    </li>
  );
}
