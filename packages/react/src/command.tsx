'use client';
import { Autocomplete, useFilter } from 'react-aria-components/Autocomplete';
import { Dialog as AriaDialog, OverlayTriggerStateContext } from 'react-aria-components/Dialog';
import { Modal as AriaModal, ModalOverlay } from 'react-aria-components/Modal';
import { useContext, useEffect, useEffectEvent, useState } from 'react';
import type { ReactNode } from 'react';
import { SearchField } from './fields.js';
import { MenuItem, MenuList, MenuSection } from './menu.js';
import type { MenuListProps } from './menu.js';
import { DepthScope } from './provider.js';
import { cx } from './internal/class-names.js';

/** A command: an item of the palette's list. Takes `shortcut` and `textValue` like a menu item. */
export const CommandItem = MenuItem;
/** A titled group of commands. */
export const CommandSection = MenuSection;

export interface CommandPaletteProps<T extends object> extends Omit<
  MenuListProps<T>,
  'renderEmptyState' | 'aria-label' | 'className' | 'style'
> {
  /** Classes for the palette's plate. */
  className?: string;
  /** Whether the palette is open, when you control it. */
  isOpen?: boolean;
  /** Whether the palette starts open, when it controls itself. @default false */
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * The key that opens and closes the palette together with ⌘ or Ctrl, from anywhere on the
   * page. `null` leaves the palette to its trigger.
   * @default 'k'
   */
  shortcut?: string | null;
  /** Names the palette for assistive technology. @default 'Commands' */
  'aria-label'?: string;
  /** Shown in the search field, and its accessible name. @default 'Search commands' */
  placeholder?: string;
  /** Shown when no command matches. A function receives the search. @default 'No matching commands' */
  emptyMessage?: ReactNode | ((search: string) => ReactNode);
}

/**
 * A searchable list of commands in a dialog cut into the dimmed page. It opens with ⌘K or
 * Ctrl+K, or from a trigger when placed in a `DialogTrigger`. Typing filters the commands;
 * choosing one runs `onAction` and closes the palette.
 */
export function CommandPalette<T extends object>({
  isOpen: isOpenProp,
  defaultOpen = false,
  onOpenChange,
  shortcut = 'k',
  'aria-label': label = 'Commands',
  placeholder = 'Search commands',
  emptyMessage = 'No matching commands',
  onAction,
  className,
  ...props
}: CommandPaletteProps<T>) {
  const trigger = useContext(OverlayTriggerStateContext);
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const [search, setSearch] = useState('');
  const { contains } = useFilter({ sensitivity: 'base' });
  const isOpen = isOpenProp ?? trigger?.isOpen ?? ownOpen;

  const setOpen = (open: boolean) => {
    if (isOpenProp === undefined) {
      if (trigger) trigger.setOpen(open);
      else setOwnOpen(open);
    }
    if (!open) setSearch('');
    onOpenChange?.(open);
  };
  const toggle = useEffectEvent(() => setOpen(!isOpen));
  useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === shortcut.toLowerCase()
      ) {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [shortcut]);

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={setOpen}
      isDismissable
      className="carved-scrim carved-command-scrim"
    >
      <AriaModal
        data-carved-depth={1}
        className={cx('carved-modal carved-command carved-carve', className)}
      >
        <DepthScope depth={1}>
          <AriaDialog aria-label={label} className="carved-command-dialog">
            <Autocomplete inputValue={search} onInputChange={setSearch} filter={contains}>
              <SearchField aria-label={placeholder} placeholder={placeholder} autoFocus />
              <MenuList
                {...props}
                onAction={(key, value) => {
                  onAction?.(key, value);
                  setOpen(false);
                }}
                renderEmptyState={() => (
                  <p className="carved-command-empty">
                    {typeof emptyMessage === 'function' ? emptyMessage(search) : emptyMessage}
                  </p>
                )}
                className="carved-command-list"
              />
            </Autocomplete>
          </AriaDialog>
        </DepthScope>
      </AriaModal>
    </ModalOverlay>
  );
}
