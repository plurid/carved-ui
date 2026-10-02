'use client';
import {
  Children,
  createContext,
  Fragment,
  isValidElement,
  useContext,
  useId,
  useRef,
  useState,
} from 'react';
import type { ComponentProps, CSSProperties, KeyboardEvent, ReactNode, Ref } from 'react';
import { useLocale } from 'react-aria-components/I18nProvider';
import { mergeProps } from 'react-aria/mergeProps';
import { useFocusRing } from 'react-aria/useFocusRing';
import { useHover } from 'react-aria/useHover';
import { useMove } from 'react-aria/useMove';
import { cx } from './internal/class-names.js';

interface PaneState {
  /** The first pane's id, for the handle to name what it resizes. */
  id?: string;
  /** Whether the pane is collapsed to nothing. */
  collapsed: boolean;
}

const PaneContext = createContext<PaneState>({ collapsed: false });

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** The panes, also when they are passed inside fragments. */
function panesOf(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
      ? panesOf(child.props.children)
      : [child],
  );
}

export interface SplitViewProps extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * How the two panes are laid out: `horizontal` places them side by side, `vertical` stacks
   * them. A stacked split view needs a height.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /** The first pane's share of the space, in percent. */
  size?: number;
  /** The first pane's share at first, in percent. Double-clicking the handle returns to it. @default 50 */
  defaultSize?: number;
  /** Called with the first pane's new share, in percent, as it changes. */
  onSizeChange?: (size: number) => void;
  /** Called with the first pane's share when a drag or key press ends, such as to keep it. */
  onSizeChangeEnd?: (size: number) => void;
  /** The smallest share of the first pane, in percent. @default 10 */
  minSize?: number;
  /** The largest share of the first pane, in percent. @default 90 */
  maxSize?: number;
  /**
   * Let the first pane collapse: dragging well past its smallest size, Home, or Enter hide it,
   * and Enter brings it back.
   * @default false
   */
  collapsible?: boolean;
  /** How far an arrow key moves the handle, in percent. @default 5 */
  step?: number;
  /** Names the handle for assistive technology. @default 'Resize' */
  handleLabel?: string;
  /** The two `SplitPane`s. */
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Two panes divided by a carved trench that you drag, or focus and move with the arrow keys,
 * to share the space between them. The first pane's share is kept in percent, so it holds as
 * the view resizes.
 */
export function SplitView({
  orientation = 'horizontal',
  size: sizeProp,
  defaultSize = 50,
  onSizeChange,
  onSizeChangeEnd,
  minSize = 10,
  maxSize = 90,
  collapsible = false,
  step = 5,
  handleLabel = 'Resize',
  className,
  style,
  children,
  ref,
  ...props
}: SplitViewProps) {
  const [ownSize, setOwnSize] = useState(defaultSize);
  const size = sizeProp ?? ownSize;
  // The share the first pane returns to when it is brought back from collapsing.
  const [restore, setRestore] = useState(size > 0 ? size : defaultSize);
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef({ start: 0, delta: 0, total: 1, last: 0 });
  const id = useId();
  const { direction } = useLocale();
  const horizontal = orientation === 'horizontal';
  const lowest = collapsible ? 0 : minSize;

  const change = (next: number) => {
    const value = Math.round(next * 10) / 10;
    if (value === size) return;
    if (value > 0) setRestore(value);
    if (sizeProp === undefined) setOwnSize(value);
    onSizeChange?.(value);
  };
  // Dragging snaps closed only well past the smallest size, so it is never closed by accident.
  const settle = (next: number) =>
    collapsible && next < minSize / 2 ? 0 : clamp(next, minSize, maxSize);

  const { moveProps } = useMove({
    onMoveStart() {
      const box = root.current?.getBoundingClientRect();
      const handle = root.current?.querySelector<HTMLElement>(':scope > .carved-split-handle');
      const length = (horizontal ? box?.width : box?.height) ?? 0;
      const across = (horizontal ? handle?.offsetWidth : handle?.offsetHeight) ?? 0;
      drag.current = { start: size, delta: 0, total: Math.max(length - across, 1), last: size };
      setDragging(true);
    },
    onMove({ deltaX, deltaY, pointerType }) {
      if (pointerType === 'keyboard') return;
      const current = drag.current;
      current.delta += horizontal ? (direction === 'rtl' ? -deltaX : deltaX) : deltaY;
      current.last = settle(current.start + (current.delta / current.total) * 100);
      change(current.last);
    },
    onMoveEnd() {
      setDragging(false);
      onSizeChangeEnd?.(Math.round(drag.current.last * 10) / 10);
    },
  });
  // The arrow keys follow the reading direction and the layout, so they are handled here.
  const pointerProps: typeof moveProps = { ...moveProps };
  delete pointerProps.onKeyDown;
  const { focusProps, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({});

  const onKeyDown = (event: KeyboardEvent) => {
    const forward = horizontal ? (direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    const backward = horizontal ? (direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    let next: number | undefined;
    if (event.key === forward)
      next = size < minSize ? minSize : clamp(size + step, lowest, maxSize);
    else if (event.key === backward)
      next = size <= minSize ? size : clamp(size - step, minSize, maxSize);
    else if (event.key === 'Home') next = lowest;
    else if (event.key === 'End') next = maxSize;
    else if (event.key === 'Enter' && collapsible) next = size > 0 ? 0 : restore;
    if (next === undefined) return;
    event.preventDefault();
    change(next);
    onSizeChangeEnd?.(next);
  };

  const [first, ...rest] = panesOf(children);
  const collapsed = size === 0;
  return (
    <div
      {...props}
      ref={(element) => {
        root.current = element;
        if (typeof ref === 'function') return ref(element);
        if (ref) ref.current = element;
      }}
      data-orientation={orientation}
      data-dragging={dragging || undefined}
      className={cx('carved-split', className)}
      style={{ ...style, '--_size': size } as CSSProperties}
    >
      <PaneContext.Provider value={{ id, collapsed }}>{first}</PaneContext.Provider>
      <div
        {...mergeProps(pointerProps, focusProps, hoverProps, {
          onKeyDown,
          onDoubleClick: () => {
            change(defaultSize);
            onSizeChangeEnd?.(defaultSize);
          },
        })}
        role="separator"
        tabIndex={0}
        aria-orientation={horizontal ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(size)}
        aria-valuemin={lowest}
        aria-valuemax={maxSize}
        aria-controls={id}
        aria-label={handleLabel}
        data-hovered={isHovered || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-dragging={dragging || undefined}
        className="carved-split-handle carved-carve"
      />
      {rest}
    </div>
  );
}

export type SplitPaneProps = ComponentProps<'div'>;

/** One of a `SplitView`'s two panes. It scrolls on its own when its content overflows. */
export function SplitPane({ className, ...props }: SplitPaneProps) {
  const { id, collapsed } = useContext(PaneContext);
  return (
    <div
      id={id}
      inert={collapsed || undefined}
      data-collapsed={collapsed || undefined}
      {...props}
      className={cx('carved-split-pane', className)}
    />
  );
}
