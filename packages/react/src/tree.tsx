'use client';
import {
  Button as AriaButton,
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent,
} from 'react-aria-components/Tree';
import type {
  TreeItemContentRenderProps,
  TreeItemProps as AriaTreeItemProps,
  TreeProps as AriaTreeProps,
} from 'react-aria-components/Tree';
import type { Key } from 'react-aria-components/Tree';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Checkbox } from './choice.js';
import { DepthScope, useCutDepth } from './provider.js';
import { withClass } from './internal/class-names.js';
import { ChevronEnd } from './internal/icons.js';

/** Levels deeper than this share the deepest well. */
const deepest = 6;

export interface TreeProps<T extends object> extends AriaTreeProps<T> {
  ref?: Ref<HTMLDivElement>;
}

/**
 * Nested items that expand and collapse, such as files in folders, cut into a well. Each open
 * item's children sit in a well of their own, a level deeper. Arrow keys move through the
 * tree: right opens an item, left closes it or moves to its parent.
 */
export function Tree<T extends object>({ className, style, ...props }: TreeProps<T>) {
  const depth = useCutDepth();
  // The well of the n-th level sits n - 1 levels below the tree's own.
  const levels: Record<string, string> = {};
  for (let level = 1; level <= deepest; level++) {
    const surface = Math.min(depth + level - 1, 5);
    levels[`--carved-tree-bg-${level}`] = `var(--carved-surface-${surface})`;
    levels[`--carved-tree-fg-${level}`] = `var(--carved-fg-${surface})`;
    levels[`--carved-tree-muted-${level}`] = `var(--carved-muted-${surface})`;
  }
  // The scope wraps the tree, so its items, and anything they open, sit a level below it.
  return (
    <DepthScope depth={depth}>
      <AriaTree
        {...props}
        data-carved-depth={depth}
        style={(values) => ({
          ...levels,
          ...(typeof style === 'function' ? style(values) : style),
        })}
        className={withClass('carved-tree carved-carve', className)}
      />
    </DepthScope>
  );
}

export interface TreeItemProps<T extends object> extends Omit<
  AriaTreeItemProps<T>,
  'children' | 'textValue'
> {
  /** The item's own content, such as its name and an icon. */
  title: ReactNode;
  /** The item as plain text, for typing to find it. Needed when `title` is not a string. */
  textValue?: string;
  /** Nested `TreeItem`s. */
  children?: ReactNode;
}

type Collection = TreeItemContentRenderProps['state']['collection'];

/** The item's previous or next sibling, skipping its content and loaders. */
function sibling(collection: Collection, key: Key, direction: 'prevKey' | 'nextKey') {
  let next = collection.getItem(key)?.[direction];
  while (next != null) {
    const node = collection.getItem(next);
    if (node?.type === 'item') return node;
    next = node?.[direction];
  }
  return null;
}

/**
 * Where this row sits in the wells of its ancestors: whether it opens its level's well, being
 * its parent's first child, and how many wells close below it, being the last row of each.
 */
function placement({ id, level, isExpanded, hasChildItems, state }: TreeItemContentRenderProps) {
  const { collection } = state;
  const opens = level > 1 && !sibling(collection, id, 'prevKey');
  let closes = 0;
  if (!(isExpanded && hasChildItems)) {
    let node = collection.getItem(id);
    for (let at = level; node && at > 1 && !sibling(collection, node.key, 'nextKey'); at--) {
      closes++;
      node = node.parentKey == null ? null : collection.getItem(node.parentKey);
    }
  }
  return { opens, closes };
}

/**
 * An item of a `Tree`. Items with children show a chevron that opens them. When several items
 * can be selected, each shows a checkbox; a single selection is inlaid instead.
 */
export function TreeItem<T extends object>({
  title,
  children,
  className,
  ...props
}: TreeItemProps<T>) {
  const textValue = props.textValue ?? (typeof title === 'string' ? title : '');
  return (
    <AriaTreeItem
      {...props}
      textValue={textValue}
      className={withClass('carved-tree-item', className)}
    >
      <TreeItemContent>
        {(content) => {
          const { level, hasChildItems, selectionBehavior, selectionMode } = content;
          const { opens, closes } = placement(content);
          const own = Math.min(level, deepest);
          return (
            <div className="carved-tree-row">
              {/* The wells this row passes through, outermost first. */}
              <span className="carved-tree-wells" aria-hidden="true">
                {Array.from({ length: level - 1 }, (_, index) => {
                  const well = index + 2;
                  // Wells closing together step in, so the innermost ends highest.
                  const closing = Math.max(well - (level - closes), 0);
                  return (
                    <span
                      key={well}
                      className="carved-tree-well"
                      data-opens={(opens && well === level) || undefined}
                      data-closes={closing > 0 || undefined}
                      style={
                        {
                          '--_well': well - 1,
                          '--_closing': closing,
                          background: `var(--carved-tree-bg-${Math.min(well, deepest)})`,
                        } as CSSProperties
                      }
                    />
                  );
                })}
              </span>
              <div
                className="carved-tree-cell"
                data-opens={opens || undefined}
                style={
                  {
                    '--_level': level - 1,
                    '--_closes': closes,
                    '--_level-ink': `var(--carved-tree-fg-${own})`,
                    '--_level-muted': `var(--carved-tree-muted-${own})`,
                    '--_level-under': `var(--carved-tree-bg-${Math.min(own + 1, deepest)})`,
                  } as CSSProperties
                }
              >
                {selectionBehavior === 'toggle' && selectionMode === 'multiple' && (
                  <Checkbox slot="selection" />
                )}
                {hasChildItems ? (
                  <AriaButton slot="chevron" className="carved-tree-chevron">
                    <ChevronEnd />
                  </AriaButton>
                ) : (
                  <span className="carved-tree-chevron" aria-hidden="true" />
                )}
                <span className="carved-tree-title">{title}</span>
              </div>
            </div>
          );
        }}
      </TreeItemContent>
      {children}
    </AriaTreeItem>
  );
}
