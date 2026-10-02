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
  TableColumnResizeStateContext,
  TableHeader as AriaTableHeader,
  useTableOptions,
} from 'react-aria-components/Table';
import type {
  CellProps as AriaCellProps,
  ColumnProps as AriaColumnProps,
  RowProps as AriaRowProps,
  TableBodyProps as AriaTableBodyProps,
  TableHeaderProps as AriaTableHeaderProps,
  ResizableTableContainerProps,
  TableProps as AriaTableProps,
} from 'react-aria-components/Table';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import { useContext } from 'react';
import type { Ref } from 'react';
import { Checkbox } from './choice.js';
import { DepthScope, useCutDepth } from './provider.js';
import { withClass } from './internal/class-names.js';
import { useIsVirtualized, useRem } from './internal/virtualized.js';
import { ChevronDown, ChevronsUpDown, ChevronUp } from './internal/icons.js';

export interface DataTableProps
  extends
    AriaTableProps,
    Pick<ResizableTableContainerProps, 'onResizeStart' | 'onResize' | 'onResizeEnd'> {
  /**
   * Let columns with `allowsResizing` be resized, by dragging their edge or with the arrow
   * keys. Column widths then come from each column's `width`, `defaultWidth` and limits, and
   * `onResize` reports them, so they can be kept.
   * @default false
   */
  isResizable?: boolean;
  ref?: Ref<HTMLTableElement>;
}

/**
 * An interactive table cut into its own well: rows can be sorted, selected and navigated with
 * the arrow keys, and columns resized. For static data, the server-rendered `Table` is lighter.
 * Inside a `Virtualizer` with `TableLayout`, it renders only the rows in view and keeps its
 * header in place: give its parent a height.
 */
export function DataTable({
  isResizable = false,
  onResizeStart,
  onResize,
  onResizeEnd,
  className,
  ...props
}: DataTableProps) {
  const depth = useCutDepth();
  const virtualized = useIsVirtualized();
  const table = (
    <DepthScope depth={depth}>
      <AriaTable
        {...props}
        data-virtualized={virtualized || undefined}
        className={withClass('carved-data-table', className)}
      />
    </DepthScope>
  );
  // The well itself never scrolls, so its carve can be drawn over what scrolls inside it, such
  // as a virtualized table's header, which stays in place and would otherwise cover it. A
  // virtualized table is its own scroller.
  return (
    <div
      data-carved-depth={depth}
      data-virtualized={virtualized || undefined}
      className="carved-table-well carved-data-well carved-carve"
    >
      {isResizable ? (
        <ResizableTableContainer
          onResizeStart={onResizeStart}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
          className="carved-data-scroll"
        >
          {table}
        </ResizableTableContainer>
      ) : virtualized ? (
        table
      ) : (
        <div className="carved-data-scroll">{table}</div>
      )}
    </div>
  );
}

/** Several rows are chosen with checkboxes; a single chosen row is inlaid instead. */
const selectsWithCheckboxes = ({
  selectionBehavior,
  selectionMode,
}: ReturnType<typeof useTableOptions>) =>
  selectionBehavior === 'toggle' && selectionMode === 'multiple';

export interface DataTableHeaderProps<T extends object> extends AriaTableHeaderProps<T> {
  ref?: Ref<HTMLTableSectionElement>;
}

/** The header row. Adds a checkbox selecting every row when several rows can be selected. */
export function DataTableHeader<T extends object>({
  columns,
  children,
  className,
  ...props
}: DataTableHeaderProps<T>) {
  const options = useTableOptions();
  // Resizable and virtualized tables size their columns from these, not from styles.
  const select = Math.round(2.75 * useRem());
  return (
    <AriaTableHeader {...props} className={withClass('carved-data-header', className)}>
      {selectsWithCheckboxes(options) && (
        <AriaColumn
          width={select}
          minWidth={select}
          maxWidth={select}
          className="carved-data-column carved-data-select"
        >
          <Checkbox slot="selection" />
        </AriaColumn>
      )}
      <Collection items={columns} dependencies={props.dependencies}>
        {children}
      </Collection>
    </AriaTableHeader>
  );
}

export interface ColumnProps extends AriaColumnProps {
  /** Show a handle at the column's end for resizing it, when the table `isResizable`. */
  allowsResizing?: boolean;
  ref?: Ref<HTMLTableCellElement>;
}

/** A column heading. Sortable columns show their direction, and sort when pressed. */
export function Column({ allowsResizing = false, className, children, ...props }: ColumnProps) {
  // Outside a resizable table there is nothing to resize, so no handle.
  const resizable = useContext(TableColumnResizeStateContext) !== null;
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
          {allowsResizing && resizable && <ColumnResizer className="carved-column-resizer" />}
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
      {/* As React Aria's own row does: cells re-render when the row's value changes. */}
      <Collection
        items={columns}
        dependencies={[props.value, ...(props.dependencies ?? [])]}
        idScope={id}
      >
        {children}
      </Collection>
    </AriaRow>
  );
}

/** A cell of a row. */
export function Cell({
  className,
  children,
  ...props
}: AriaCellProps & { ref?: Ref<HTMLTableCellElement> }) {
  // Virtualized rows have one height, so a cell's content stays on one line and is cut short.
  const virtualized = useIsVirtualized();
  return (
    <AriaCell {...props} className={withClass('carved-data-cell', className)}>
      {virtualized
        ? composeRenderProps(children, (content) => (
            <span className="carved-data-cell-content">{content}</span>
          ))
        : children}
    </AriaCell>
  );
}
