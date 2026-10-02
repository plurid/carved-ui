'use client';
import { useMemo } from 'react';
import { useLocale } from 'react-aria-components/I18nProvider';
import {
  GridLayout as BaseGridLayout,
  ListLayout,
  Size,
  TableLayout,
  Virtualizer as AriaVirtualizer,
  WaterfallLayout,
} from 'react-aria-components/Virtualizer';
import type {
  GridLayoutOptions,
  ListLayoutOptions,
  TableLayoutProps,
  VirtualizerProps as AriaVirtualizerProps,
  WaterfallLayoutOptions,
} from 'react-aria-components/Virtualizer';
import { useRem } from './internal/virtualized.js';

/** A width and height in pixels, for the sizes a `GridLayout` or `WaterfallLayout` takes. */
export { Size as LayoutSize };
export { ListLayout, TableLayout, WaterfallLayout };
export type { GridLayoutOptions, ListLayoutOptions, TableLayoutProps, WaterfallLayoutOptions };

function useDirection(): GridLayoutOptions {
  const { direction } = useLocale();
  return useMemo(() => ({ direction }), [direction]);
}

/** Places items in rows of equal columns, mirrored for right-to-left text. */
export class GridLayout<T, O extends GridLayoutOptions = GridLayoutOptions> extends BaseGridLayout<
  T,
  O
> {
  /** The virtualizer calls this while rendering, to read the text direction. */
  useLayoutOptions = useDirection;
}

type Layout<O> = AriaVirtualizerProps<O>['layout'];

/** Whether a layout, given as a class or an instance, is of a kind. */
function isA(layout: unknown, kind: abstract new (...args: never[]) => unknown) {
  return typeof layout === 'function'
    ? layout === kind || layout.prototype instanceof kind
    : layout instanceof kind;
}

/** Sizes that fit Carved's rows, in pixels. Rows that vary are measured as they appear. */
function defaults(layout: unknown, rem: number, options: object | undefined): object {
  // A table layout is also a list layout, so it is asked first.
  if (isA(layout, TableLayout))
    return {
      headingHeight: 2.5 * rem,
      // Rows of one line keep a fixed height, unless told to measure them.
      ...(!(options && 'estimatedRowHeight' in options) && { rowHeight: 2.75 * rem }),
    };
  if (isA(layout, ListLayout))
    return { estimatedRowSize: 2.75 * rem, estimatedHeadingSize: 2 * rem, padding: 0.25 * rem };
  if (isA(layout, BaseGridLayout) || isA(layout, WaterfallLayout))
    return { minItemSize: new Size(9 * rem, 9 * rem), minSpace: new Size(0.5 * rem, 0.5 * rem) };
  return {};
}

export interface VirtualizerProps<O = ListLayoutOptions> extends Omit<
  AriaVirtualizerProps<O>,
  'layout'
> {
  /**
   * How items are placed: `ListLayout` in rows, `TableLayout` for a `DataTable`, `GridLayout`
   * in columns of tiles, `WaterfallLayout` in columns of tiles of different heights. A class or
   * an instance.
   * @default ListLayout
   */
  layout?: Layout<O>;
}

/**
 * Renders only the items in view of the collection inside it, so a list, grid, tree or table
 * stays fast with thousands of items. Give the collection a height to scroll within.
 */
export function Virtualizer<O = ListLayoutOptions>({
  layout = ListLayout as unknown as Layout<O>,
  layoutOptions,
  ...props
}: VirtualizerProps<O>) {
  const rem = useRem();
  const options = useMemo(
    () =>
      ({ ...defaults(layout, rem, layoutOptions as object | undefined), ...layoutOptions }) as O,
    [layout, rem, layoutOptions],
  );
  return <AriaVirtualizer {...props} layout={layout} layoutOptions={options} />;
}
