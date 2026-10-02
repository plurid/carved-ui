'use client';
import {
  Collection,
  Header,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
} from 'react-aria-components/ListBox';
import type {
  ListBoxItemProps as AriaListBoxItemProps,
  ListBoxProps as AriaListBoxProps,
  ListBoxSectionProps as AriaListBoxSectionProps,
} from 'react-aria-components/ListBox';
import { Select as AriaSelect, SelectValue as AriaSelectValue } from 'react-aria-components/Select';
import type {
  SelectProps as AriaSelectProps,
  SelectValueProps,
} from 'react-aria-components/Select';
import { ComboBox as AriaComboBox } from 'react-aria-components/ComboBox';
import type { ComboBoxProps as AriaComboBoxProps } from 'react-aria-components/ComboBox';
import { Button as AriaButton } from 'react-aria-components/Button';
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
} from 'react-aria-components/GridList';
import type {
  GridListItemProps as AriaGridListItemProps,
  GridListProps as AriaGridListProps,
} from 'react-aria-components/GridList';
import { Tag as AriaTag, TagGroup as AriaTagGroup, TagList } from 'react-aria-components/TagGroup';
import type {
  TagGroupProps as AriaTagGroupProps,
  TagListProps,
  TagProps as AriaTagProps,
} from 'react-aria-components/TagGroup';
import { Text } from 'react-aria-components/Text';
import { Input as AriaInput } from 'react-aria-components/Input';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import type { ReactNode, Ref } from 'react';
import { Description, FieldButton, FieldError, InputGroup, Label } from './fields.js';
import type { FieldProps } from './fields.js';
import { Checkbox } from './choice.js';
import { Popover } from './overlays.js';
import { useCutDepth } from './provider.js';
import { cx, withClass } from './internal/class-names.js';
import { Check, ChevronDown, Close } from './internal/icons.js';

type SelectionMode = 'single' | 'multiple';

export interface ListBoxProps<T extends object> extends AriaListBoxProps<T> {
  ref?: Ref<HTMLDivElement>;
}

/** A list of options. Used inside `Select` and `ComboBox`, or on its own. */
export function ListBox<T extends object>({ className, ...props }: ListBoxProps<T>) {
  return <AriaListBox {...props} className={withClass('carved-listbox', className)} />;
}

export interface ListBoxItemProps<T extends object> extends AriaListBoxItemProps<T> {
  ref?: Ref<HTMLDivElement>;
}

/** An option. Shows a check while selected. */
export function ListBoxItem<T extends object>({
  className,
  children,
  ...props
}: ListBoxItemProps<T>) {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <AriaListBoxItem
      {...props}
      textValue={textValue}
      className={withClass('carved-item', className)}
    >
      {composeRenderProps(children, (content, { isSelected }) => (
        <>
          <span className="carved-item-label">{content}</span>
          {isSelected && <Check className="carved-item-check" />}
        </>
      ))}
    </AriaListBoxItem>
  );
}

export interface ListBoxSectionProps<T extends object> extends Omit<
  AriaListBoxSectionProps<T>,
  'children'
> {
  /** The visible heading of the group. */
  title?: ReactNode;
  children: ReactNode | ((item: T) => ReactNode);
}

/** A titled group of options. */
export function ListBoxSection<T extends object>({
  title,
  items,
  children,
  className,
  ...props
}: ListBoxSectionProps<T>) {
  return (
    <AriaListBoxSection {...props} className={cx('carved-section', className)}>
      {title && <Header className="carved-section-title">{title}</Header>}
      <Collection items={items}>{children}</Collection>
    </AriaListBoxSection>
  );
}

export const SelectItem = ListBoxItem;
export const SelectSection = ListBoxSection;
export const ComboBoxItem = ListBoxItem;
export const ComboBoxSection = ListBoxSection;

export function SelectValue<T extends object>({ className, ...props }: SelectValueProps<T>) {
  return <AriaSelectValue {...props} className={withClass('carved-select-value', className)} />;
}

export interface SelectRootProps<
  T extends object,
  M extends SelectionMode = 'single',
> extends AriaSelectProps<T, M> {
  ref?: Ref<HTMLDivElement>;
}

/** The bare select, for arranging its trigger, popover and list yourself. */
export function SelectRoot<T extends object, M extends SelectionMode = 'single'>({
  className,
  ...props
}: SelectRootProps<T, M>) {
  return <AriaSelect {...props} className={withClass('carved-field carved-select', className)} />;
}

export interface SelectProps<T extends object, M extends SelectionMode = 'single'>
  extends Omit<SelectRootProps<T, M>, 'children'>, FieldProps {
  /** Options to render with the `children` function. */
  items?: Iterable<T>;
  /** `SelectItem`s and `SelectSection`s, or a function rendering each of `items`. */
  children: ReactNode | ((item: T) => ReactNode);
}

/** A labelled field for choosing from a list of options. */
export function Select<T extends object, M extends SelectionMode = 'single'>({
  label,
  description,
  errorMessage,
  items,
  children,
  ...props
}: SelectProps<T, M>) {
  return (
    <SelectRoot {...props}>
      {label && <Label>{label}</Label>}
      <AriaButton className="carved-select-trigger carved-carve">
        <SelectValue />
        <ChevronDown className="carved-select-chevron" />
      </AriaButton>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="carved-listbox-popover">
        <ListBox items={items}>{children}</ListBox>
      </Popover>
    </SelectRoot>
  );
}

export interface ComboBoxRootProps<
  T extends object,
  M extends SelectionMode = 'single',
> extends AriaComboBoxProps<T, M> {
  ref?: Ref<HTMLDivElement>;
}

/** The bare combo box, for arranging its input, popover and list yourself. */
export function ComboBoxRoot<T extends object, M extends SelectionMode = 'single'>({
  className,
  ...props
}: ComboBoxRootProps<T, M>) {
  return (
    <AriaComboBox {...props} className={withClass('carved-field carved-combobox', className)} />
  );
}

export interface ComboBoxProps<T extends object, M extends SelectionMode = 'single'>
  extends Omit<ComboBoxRootProps<T, M>, 'children'>, FieldProps {
  placeholder?: string;
  /** `ComboBoxItem`s and `ComboBoxSection`s, or a function rendering each item. */
  children: ReactNode | ((item: T) => ReactNode);
}

/** A text field that filters a list of options as you type. */
export function ComboBox<T extends object, M extends SelectionMode = 'single'>({
  label,
  description,
  errorMessage,
  placeholder,
  children,
  ...props
}: ComboBoxProps<T, M>) {
  return (
    <ComboBoxRoot {...props}>
      {label && <Label>{label}</Label>}
      <InputGroup>
        <AriaInput className="carved-group-input" placeholder={placeholder} />
        <FieldButton>
          <ChevronDown />
        </FieldButton>
      </InputGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="carved-listbox-popover">
        <ListBox>{children}</ListBox>
      </Popover>
    </ComboBoxRoot>
  );
}

export interface GridListProps<T extends object> extends AriaGridListProps<T> {
  ref?: Ref<HTMLDivElement>;
}

/**
 * An interactive list cut into a well. Unlike a list box, its items can hold buttons, links
 * and other controls; arrow keys move between items, and Tab into an item's controls.
 */
export function GridList<T extends object>({ className, ...props }: GridListProps<T>) {
  return (
    <AriaGridList
      {...props}
      data-carved-depth={useCutDepth()}
      className={withClass('carved-grid-list carved-carve', className)}
    />
  );
}

export interface GridListItemProps<T extends object> extends AriaGridListItemProps<T> {
  ref?: Ref<HTMLDivElement>;
}

/** An item of a `GridList`. Shows a checkbox when several items can be selected. */
export function GridListItem<T extends object>({
  className,
  children,
  ...props
}: GridListItemProps<T>) {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <AriaGridListItem
      {...props}
      textValue={textValue}
      className={withClass('carved-grid-item', className)}
    >
      {composeRenderProps(children, (content, { selectionMode, selectionBehavior }) => (
        <>
          {selectionMode === 'multiple' && selectionBehavior === 'toggle' && (
            <Checkbox slot="selection" />
          )}
          <span className="carved-grid-item-content">{content}</span>
        </>
      ))}
    </AriaGridListItem>
  );
}

export interface TagGroupProps<T extends object>
  extends
    Omit<AriaTagGroupProps, 'children'>,
    Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
  label?: ReactNode;
  /** Help text below the tags. */
  description?: ReactNode;
  /** Shown below the tags, such as when too many are chosen. */
  errorMessage?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A labelled set of tags. Tags can be selected like toggles, and removed with their button
 * or the Delete key when `onRemove` is set.
 */
export function TagGroup<T extends object>({
  label,
  description,
  errorMessage,
  items,
  children,
  renderEmptyState,
  className,
  ...props
}: TagGroupProps<T>) {
  return (
    <AriaTagGroup {...props} className={cx('carved-field carved-tag-group', className)}>
      {label && <Label>{label}</Label>}
      <TagList items={items} renderEmptyState={renderEmptyState} className="carved-tag-list">
        {children}
      </TagList>
      {description && <Description>{description}</Description>}
      {errorMessage && (
        <Text slot="errorMessage" className="carved-field-error">
          {errorMessage}
        </Text>
      )}
    </AriaTagGroup>
  );
}

export interface TagProps extends AriaTagProps {
  ref?: Ref<HTMLDivElement>;
}

/** A tag: a small carved pill, inlaid with the accent when selected. */
export function Tag({ className, children, ...props }: TagProps) {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <AriaTag
      {...props}
      textValue={textValue}
      className={withClass('carved-tag carved-carve', className)}
    >
      {composeRenderProps(children, (content, { allowsRemoving }) => (
        <>
          {content}
          {allowsRemoving && (
            <AriaButton slot="remove" className="carved-tag-remove">
              <Close />
            </AriaButton>
          )}
        </>
      ))}
    </AriaTag>
  );
}
