'use client';
import { DropZone as AriaDropZone } from 'react-aria-components/DropZone';
import type { DropZoneProps as AriaDropZoneProps } from 'react-aria-components/DropZone';
import { FileTrigger as AriaFileTrigger } from 'react-aria-components/FileTrigger';
import { Text } from 'react-aria-components/Text';
import type { FileDropItem } from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { Button } from './actions.js';
import { DepthScope, useCutDepth } from './provider.js';
import { withClass } from './internal/class-names.js';
import { Upload } from './internal/icons.js';

/** Opens the system file browser when its child, such as a `Button`, is pressed. */
export const FileTrigger = AriaFileTrigger;

/** Whether a file matches a list of MIME types (`image/png`, `image/*`) or extensions (`.pdf`). */
function accepts(file: File, types: readonly string[] | undefined) {
  if (!types?.length) return true;
  const name = file.name.toLowerCase();
  return types.some((type) => {
    const accepted = type.trim().toLowerCase();
    if (accepted.startsWith('.')) return name.endsWith(accepted);
    if (accepted.endsWith('/*')) return file.type.startsWith(accepted.slice(0, -1));
    return file.type === accepted;
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
  /** Receives the files that were dropped, pasted or chosen. */
  onSelect?: (files: File[]) => void;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A well that takes files: drop them in, paste them, or choose them with its button. While
 * files are dragged over it, the well cuts deeper and its edge lights up.
 */
export function DropZone({
  label = 'Drop files here',
  description,
  buttonLabel = 'Choose files',
  acceptedFileTypes,
  allowsMultiple = false,
  onSelect,
  className,
  ...props
}: DropZoneProps) {
  const depth = useCutDepth();
  const select = (files: File[]) => {
    const kept = files.filter((file) => accepts(file, acceptedFileTypes));
    if (kept.length) onSelect?.(allowsMultiple ? kept : kept.slice(0, 1));
  };
  return (
    <AriaDropZone
      {...props}
      getDropOperation={(types) => {
        // While dragging, only MIME types are known; extensions are checked on drop.
        const known = acceptedFileTypes?.filter((type) => type.includes('/')) ?? [];
        const onlyKnown = known.length > 0 && known.length === acceptedFileTypes?.length;
        return onlyKnown && !types.has(known) ? 'cancel' : 'copy';
      }}
      onDrop={async (event) => {
        const files = event.items.filter((item): item is FileDropItem => item.kind === 'file');
        select(await Promise.all(files.map((item) => item.getFile())));
      }}
      data-carved-depth={depth}
      className={withClass('carved-drop-zone carved-carve', className)}
    >
      <DepthScope depth={depth}>
        <Upload className="carved-drop-zone-icon" />
        <Text slot="label" className="carved-drop-zone-label">
          {label}
        </Text>
        {description && <span className="carved-drop-zone-description">{description}</span>}
        <AriaFileTrigger
          acceptedFileTypes={acceptedFileTypes}
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
