'use client';
import { Autocomplete as AriaAutocomplete, useFilter } from 'react-aria-components/Autocomplete';
import type { AutocompleteProps as AriaAutocompleteProps } from 'react-aria-components/Autocomplete';

export { useFilter };

export interface AutocompleteProps<T extends object = object> extends Omit<
  AriaAutocompleteProps<T>,
  'filter'
> {
  /**
   * How an item matches what is typed: `contains` it anywhere, `startsWith` it, your own
   * function, or `null` to filter the collection's `items` yourself, such as on a server.
   * Matching ignores case and accents.
   * @default 'contains'
   */
  filter?: 'contains' | 'startsWith' | AriaAutocompleteProps<T>['filter'] | null;
}

/**
 * Connects a `SearchField` to the collection that follows it, such as a `ListBox`, `MenuList`,
 * `GridList` or `DataTable`, and filters the collection as you type. In a list box or menu, the
 * arrow keys move through the matches while you keep typing; a grid list or table is reached
 * with Tab. Wrap one field and one collection, and keep other controls outside.
 */
export function Autocomplete<T extends object = object>({
  filter = 'contains',
  ...props
}: AutocompleteProps<T>) {
  const { contains, startsWith } = useFilter({ sensitivity: 'base' });
  const match =
    filter === 'contains' ? contains : filter === 'startsWith' ? startsWith : (filter ?? undefined);
  return <AriaAutocomplete {...props} filter={match} />;
}
