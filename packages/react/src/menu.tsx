'use client';
import {
  Collection,
  Header,
  Keyboard,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Separator,
  SubmenuTrigger as AriaSubmenuTrigger,
} from 'react-aria-components/Menu';
import type {
  MenuItemProps as AriaMenuItemProps,
  MenuProps as AriaMenuProps,
  MenuSectionProps as AriaMenuSectionProps,
  SeparatorProps,
} from 'react-aria-components/Menu';
import type { PopoverProps as AriaPopoverProps } from 'react-aria-components/Popover';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import type { ReactNode, Ref } from 'react';
import { Popover } from './overlays.js';
import { cx, withClass } from './internal/class-names.js';
import { Check, ChevronEnd } from './internal/icons.js';

export const MenuTrigger = AriaMenuTrigger;
export const SubmenuTrigger = AriaSubmenuTrigger;

export interface MenuListProps<T extends object> extends AriaMenuProps<T> {
  ref?: Ref<HTMLDivElement>;
}

/** A menu rendered in place, without a popover. */
export function MenuList<T extends object>({ className, ...props }: MenuListProps<T>) {
  return <AriaMenu {...props} className={withClass('carved-menu', className)} />;
}

export interface MenuProps<T extends object> extends MenuListProps<T> {
  /** Where the menu opens relative to its trigger. @default 'bottom start' */
  placement?: AriaPopoverProps['placement'];
}

/** A popover menu. Place inside `MenuTrigger` with its trigger, or inside `SubmenuTrigger`. */
export function Menu<T extends object>({ placement = 'bottom start', ...props }: MenuProps<T>) {
  return (
    <Popover placement={placement} className="carved-menu-popover">
      <MenuList {...props} />
    </Popover>
  );
}

export interface MenuItemProps<T extends object> extends AriaMenuItemProps<T> {
  /** A keyboard shortcut shown at the end of the item, such as `⌘S`. Display only. */
  shortcut?: string;
  ref?: Ref<HTMLDivElement>;
}

/** An action or option. Shows a check when selected and a chevron when it opens a submenu. */
export function MenuItem<T extends object>({
  shortcut,
  className,
  children,
  ...props
}: MenuItemProps<T>) {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <AriaMenuItem {...props} textValue={textValue} className={withClass('carved-item', className)}>
      {composeRenderProps(children, (content, { isSelected, hasSubmenu, selectionMode }) => (
        <>
          {selectionMode !== 'none' && (
            <span className="carved-item-indicator">{isSelected && <Check />}</span>
          )}
          <span className="carved-item-label">{content}</span>
          {shortcut && <Keyboard className="carved-item-shortcut">{shortcut}</Keyboard>}
          {hasSubmenu && <ChevronEnd className="carved-item-chevron" />}
        </>
      ))}
    </AriaMenuItem>
  );
}

export interface MenuSectionProps<T extends object> extends Omit<
  AriaMenuSectionProps<T>,
  'children'
> {
  title?: ReactNode;
  children: ReactNode | ((item: T) => ReactNode);
}

/** A titled group of menu items. */
export function MenuSection<T extends object>({
  title,
  items,
  children,
  className,
  ...props
}: MenuSectionProps<T>) {
  return (
    <AriaMenuSection {...props} className={cx('carved-section', className)}>
      {title && <Header className="carved-section-title">{title}</Header>}
      <Collection items={items}>{children}</Collection>
    </AriaMenuSection>
  );
}

/** A divider between groups of items. */
export function MenuSeparator({ className, ...props }: SeparatorProps) {
  return <Separator {...props} className={cx('carved-menu-separator', className)} />;
}
