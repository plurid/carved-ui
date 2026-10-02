'use client';
import {
  Cell as AriaCell,
  Collection,
  Column as AriaColumn,
  ColumnResizer,
  ResizableTableContainer,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  useTableOptions,
} from 'react-aria-components/Table';
import type {
  CellProps as AriaCellProps,
  ColumnProps as AriaColumnProps,
  RowProps as AriaRowProps,
  TableBodyProps as AriaTableBodyProps,
  TableHeaderProps as AriaTableHeaderProps,
  TableProps as AriaTableProps,
} from 'react-aria-components/Table';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import type { Ref } from 'react';
import { Checkbox } from './choice.js';
import { DepthScope, useCutDepth } from './provider.js';
import { withClass } from './internal/class-names.js';
import { ChevronDown, ChevronsUpDown, ChevronUp } from './internal/icons.js';

export interface DataTableProps extends AriaTableProps {
  /**
   * Let columns with `allowsResizing` be resized, by dragging their edge or with the arrow
   * keys. Column widths then come from each column's `width`, `defaultWidth` and limits.
   * @default false
   */
  isResizable?: boolean;
  ref?: Ref<HTMLTableElement>;
}

/**
 * An interactive table cut into its own well: rows can be sorted, selected and navigated with
 * the arrow keys, and columns resized. For static data, the server-rendered `Table` is lighter.
 */
export function DataTable({ isResizable = false, className, ...props }: DataTableProps) {
  const depth = useCutDepth();
  const Well = isResizable ? ResizableTableContainer : 'div';
  return (
    <Well data-carved-depth={depth} className="carved-table-well carved-data-well carved-carve">
      <DepthScope depth={depth}>
        <AriaTable {...props} className={withClass('carved-data-table', className)} />
      </DepthScope>
    </Well>
  );
}

/** Several rows are chosen with checkboxes; a single chosen row is inlaid instead. */
const selectsWithCheckboxes = ({
  selectionBehavior,
  selectionMode,
}: ReturnType<typeof useTableOptions>) =>
  selectionBehavior === 'toggle' && selectionMode === 'multiple';

/** The header row. Adds a checkbox selecting every row when several rows can be selected. */
export function DataTableHeader<T extends object>({
  columns,
  children,
  className,
  ...props
}: AriaTableHeaderProps<T> & { ref?: Ref<HTMLTableSectionElement> }) {
  const options = useTableOptions();
  return (
    <AriaTableHeader {...props} className={withClass('carved-data-header', className)}>
      {selectsWithCheckboxes(options) && (
        <AriaColumn className="carved-data-column carved-data-select">
          <Checkbox slot="selection" />
        </AriaColumn>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  );
}

export interface ColumnProps extends AriaColumnProps {
  /** Show a handle at the column's end for resizing it. Needs `isResizable` on the table. */
  allowsResizing?: boolean;
  ref?: Ref<HTMLTableCellElement>;
}

/** A column heading. Sortable columns show their direction, and sort when pressed. */
export function Column({ allowsResizing = false, className, children, ...props }: ColumnProps) {
  return (
    <AriaColumn {...props} className={withClass('carved-data-column', className)}>
      {composeRenderProps(children, (content, { allowsSorting, sortDirection }) => (
        <span className="carved-data-column-content">
          <span className="carved-data-column-label">{content}</span>
          {allowsSorting && (
            <span className="carved-sort" data-direction={sortDirection} aria-hidden="true">
              {sortDirection === 'ascending' ? (
                <ChevronUp />
              ) : sortDirection === 'descending' ? (
                <ChevronDown />
              ) : (
                <ChevronsUpDown />
              )}
            </span>
          )}
          {allowsResizing && <ColumnResizer className="carved-column-resizer" />}
        </span>
      ))}
    </AriaColumn>
  );
}

export interface DataTableBodyProps<T extends object> extends AriaTableBodyProps<T> {
  ref?: Ref<HTMLTableSectionElement>;
}

/** The rows. `renderEmptyState` fills the table while there are none, such as while loading. */
export function DataTableBody<T extends object>({
  renderEmptyState,
  className,
  ...props
}: DataTableBodyProps<T>) {
  return (
    <AriaTableBody
      {...props}
      {...(renderEmptyState && {
        renderEmptyState: (state) => (
          <div className="carved-data-empty">{renderEmptyState(state)}</div>
        ),
      })}
      className={withClass('carved-data-body', className)}
    />
  );
}

export interface RowProps<T extends object> extends AriaRowProps<T> {
  ref?: Ref<HTMLTableRowElement>;
}

/** A row. Adds its checkbox when several rows can be selected. */
export function Row<T extends object>({ id, columns, children, className, ...props }: RowProps<T>) {
  const options = useTableOptions();
  return (
    <AriaRow id={id} {...props} className={withClass('carved-data-row', className)}>
      {selectsWithCheckboxes(options) && (
        <AriaCell className="carved-data-cell carved-data-select">
          <Checkbox slot="selection" />
        </AriaCell>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  );
}

export function Cell({ className, ...props }: AriaCellProps & { ref?: Ref<HTMLTableCellElement> }) {
  return <AriaCell {...props} className={withClass('carved-data-cell', className)} />;
}
