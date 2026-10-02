'use client';
import { Dialog as AriaDialog, OverlayTriggerStateContext } from 'react-aria-components/Dialog';
import { Modal as AriaModal, ModalOverlay } from 'react-aria-components/Modal';
import { PopoverContext } from 'react-aria-components/Popover';
import { useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Autocomplete } from './autocomplete.js';
import { SearchField } from './fields.js';
import { MenuItem, MenuList, MenuSection } from './menu.js';
import type { MenuListProps } from './menu.js';
import { DepthScope } from './provider.js';
import { cx } from './internal/class-names.js';

/**
 * The palettes listening for their shortcut, latest first. Only the latest mounted answers, so
 * a page with several (such as a documentation page) opens one at a time.
 */
const listening: (() => void)[] = [];

const isMac = () =>
  typeof navigator !== 'undefined' &&
  /mac|iphone|ipad/i.test(
    (navigator as Navigator & { userAgentData?: { platform: string } }).userAgentData?.platform ??
      navigator.platform,
  );

/**
 * Whether a key press is the palette's shortcut: ⌘ and the key on Apple platforms, Ctrl and
 * the key elsewhere. The physical key is matched, so it works on any keyboard layout. A press
 * that something else handled, a held key, and text being composed are left alone, and so are
 * rich-text editors, where ⌘K usually inserts a link.
 */
function isShortcut(event: KeyboardEvent, key: string) {
  if (event.defaultPrevented || event.repeat || event.isComposing) return false;
  if (event.target instanceof HTMLElement && event.target.isContentEditable) return false;
  const modifier = isMac() ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
  return (
    modifier &&
    !event.altKey &&
    !event.shiftKey &&
    (event.code === `Key${key.toUpperCase()}` || event.key.toLowerCase() === key.toLowerCase())
  );
}

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
  /** Called when the palette opens or closes, by its shortcut, its trigger or a chosen command. */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * The key that opens and closes the palette from anywhere on the page, together with ⌘ on
   * Apple platforms and Ctrl elsewhere. `null` leaves the palette to its trigger.
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
  // Placed in a DialogTrigger, the trigger opens and closes the palette. Other overlays also
  // provide their state, so it is adopted only from a dialog trigger.
  const popover = useContext(PopoverContext) as { trigger?: string } | null;
  const overlay = useContext(OverlayTriggerStateContext);
  const trigger = popover?.trigger === 'DialogTrigger' ? overlay : null;
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const [search, setSearch] = useState('');
  const isOpen = isOpenProp ?? trigger?.isOpen ?? ownOpen;

  // Each opening starts from an empty search, however the palette was last closed.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setSearch('');
  }

  const setOpen = (open: boolean) => {
    if (isOpenProp === undefined) {
      if (trigger) trigger.setOpen(open);
      else setOwnOpen(open);
    }
    onOpenChange?.(open);
  };
  // The shortcut always toggles from the latest state, without re-subscribing on each render.
  const toggle = useRef(() => {});
  useEffect(() => {
    toggle.current = () => setOpen(!isOpen);
  });
  useEffect(() => {
    if (!shortcut) return;
    const answer = () => toggle.current();
    listening.unshift(answer);
    const onKeyDown = (event: KeyboardEvent) => {
      if (listening[0] !== answer || !isShortcut(event, shortcut)) return;
      event.preventDefault();
      answer();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      listening.splice(listening.indexOf(answer), 1);
    };
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
            <Autocomplete inputValue={search} onInputChange={setSearch}>
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
