'use client';
import { Button as AriaButton } from 'react-aria-components/Button';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components/Button';
import { Link as AriaLink } from 'react-aria-components/Link';
import type { LinkProps as AriaLinkProps } from 'react-aria-components/Link';
import { ToggleButton as AriaToggleButton } from 'react-aria-components/ToggleButton';
import type { ToggleButtonProps as AriaToggleButtonProps } from 'react-aria-components/ToggleButton';
import { ToggleButtonGroup as AriaToggleButtonGroup } from 'react-aria-components/ToggleButtonGroup';
import type { ToggleButtonGroupProps as AriaToggleButtonGroupProps } from 'react-aria-components/ToggleButtonGroup';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import type { Ref } from 'react';
import { withClass } from './internal/class-names.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends AriaButtonProps {
  /**
   * Visual weight. `primary` and `danger` are inlaid with a tone; `secondary` is a plain
   * carve; `ghost` is cut only while touched.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: Size;
  ref?: Ref<HTMLButtonElement>;
}

/** A carved pill. Hovering cuts it deeper; pressing cuts it deepest. */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      {...props}
      data-variant={variant}
      data-size={size}
      className={withClass('carved-button carved-carve', className)}
    >
      {composeRenderProps(children, (content, { isPending }) => (
        <>
          {isPending && <span className="carved-button-spinner" aria-hidden="true" />}
          {content}
        </>
      ))}
    </AriaButton>
  );
}

export interface IconButtonProps extends ButtonProps {
  /** Names the action for assistive technology. Required, as the button shows only an icon. */
  'aria-label': string;
}

/** A square button holding a single icon. Ghost by default. */
export function IconButton({ variant = 'ghost', className, ...props }: IconButtonProps) {
  if (!props['aria-label']?.trim())
    throw new TypeError('IconButton requires a non-empty aria-label');
  return (
    <Button {...props} variant={variant} className={withClass('carved-icon-button', className)} />
  );
}

export interface LinkProps extends AriaLinkProps {
  /** `link` is underlined inline text; any button variant renders the link as a button. @default 'link' */
  variant?: 'link' | ButtonVariant;
  /** Size when rendered as a button. @default 'md' */
  size?: Size;
  ref?: Ref<HTMLAnchorElement>;
}

/** Navigation, as inline text or styled as a button. */
export function Link({ variant = 'link', size = 'md', className, ...props }: LinkProps) {
  const asButton = variant !== 'link';
  return (
    <AriaLink
      {...props}
      data-variant={variant}
      {...(asButton ? { 'data-size': size } : {})}
      className={withClass(asButton ? 'carved-button carved-carve' : 'carved-link', className)}
    />
  );
}

export interface ToggleButtonProps extends AriaToggleButtonProps {
  /** @default 'md' */
  size?: Size;
  ref?: Ref<HTMLButtonElement>;
}

/** A button that stays pressed. When selected, it is inlaid with the accent. */
export function ToggleButton({ size = 'md', className, ...props }: ToggleButtonProps) {
  return (
    <AriaToggleButton
      {...props}
      data-size={size}
      className={withClass('carved-button carved-toggle carved-carve', className)}
    />
  );
}

export interface ToggleButtonGroupProps extends AriaToggleButtonGroupProps {
  ref?: Ref<HTMLDivElement>;
}

/** A carved channel of toggle buttons, for picking one or several options. */
export function ToggleButtonGroup({ className, ...props }: ToggleButtonGroupProps) {
  return (
    <AriaToggleButtonGroup
      {...props}
      className={withClass('carved-toggle-group carved-carve', className)}
    />
  );
}
