import { useContext, useSyncExternalStore } from 'react';
import { CollectionRendererContext } from 'react-aria-components/CollectionBuilder';

/**
 * Whether the collection rendering here is virtualized: React Aria then positions each item
 * itself, so styles that rely on items flowing one after another must step aside.
 */
export function useIsVirtualized() {
  return useContext(CollectionRendererContext).isVirtualized === true;
}

const unchanging = () => () => {};
const rootFontSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

/** Pixels in a rem, so layouts measured in pixels follow the reader's font size. */
export function useRem() {
  return useSyncExternalStore(unchanging, rootFontSize, () => 16);
}
