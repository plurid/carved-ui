'use client';
import { Select as AriaSelect, SelectValue as AriaSelectValue } from 'react-aria-components/Select';
import { ComboBox as AriaComboBox } from 'react-aria-components/ComboBox';
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
} from 'react-aria-components/ListBox';
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger as AriaMenuTrigger,
  MenuSection as AriaMenuSection,
  Header as AriaHeader,
  SubmenuTrigger as AriaSubmenuTrigger,
} from 'react-aria-components/Menu';
import type {
  SelectProps,
  ComboBoxProps,
  ListBoxProps,
  ListBoxItemProps,
  MenuProps,
  MenuItemProps,
} from 'react-aria-components';
import type { ComponentProps } from 'react';
import { Separator as AriaSeparator } from 'react-aria-components/Separator';
import { cx } from './internal/utils.js';

export function Select<T extends object>({ className, ...props }: SelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      className={(state) =>
        cx(
          'carved-field',
          'carved-select',
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
}
export function SelectValue({ className, ...props }: ComponentProps<typeof AriaSelectValue>) {
  return (
    <AriaSelectValue
      {...props}
      className={(state) =>
        cx('carved-select-value', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function Combobox<T extends object>({ className, ...props }: ComboBoxProps<T>) {
  return (
    <AriaComboBox
      {...props}
      className={(state) =>
        cx(
          'carved-field',
          'carved-combobox',
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
}
export function ListBox<T extends object>({ className, ...props }: ListBoxProps<T>) {
  return (
    <AriaListBox
      {...props}
      className={(state) =>
        cx('carved-listbox', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function ListBoxItem<T extends object>({ className, ...props }: ListBoxItemProps<T>) {
  return (
    <AriaListBoxItem
      {...props}
      className={(state) =>
        cx('carved-listbox-item', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export const MenuTrigger = AriaMenuTrigger;
export const SubmenuTrigger = AriaSubmenuTrigger;
/** Collection-aware separators preserve the items after them in an Aria menu. */
export function MenuSeparator({ className, ...props }: ComponentProps<typeof AriaSeparator>) {
  return <AriaSeparator {...props} className={cx('carved-separator', className)} />;
}
export function Menu<T extends object>({ className, ...props }: MenuProps<T>) {
  return (
    <AriaMenu
      {...props}
      className={(state) =>
        cx('carved-menu', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function MenuItem<T extends object>({ className, ...props }: MenuItemProps<T>) {
  return (
    <AriaMenuItem
      {...props}
      className={(state) =>
        cx('carved-menu-item', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export const MenuSection = AriaMenuSection;
export function MenuHeader({ className, ...props }: ComponentProps<typeof AriaHeader>) {
  return <AriaHeader {...props} className={cx('carved-menu-header', className)} />;
}
