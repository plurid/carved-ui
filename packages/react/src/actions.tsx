'use client';
import { Button as AriaButton } from 'react-aria-components/Button';
import { Link as AriaLink } from 'react-aria-components/Link';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components/Button';
import type { LinkProps as AriaLinkProps } from 'react-aria-components/Link';
import type { ComponentProps } from 'react';
import { cx } from './internal/utils.js';
import type { Size, Variant } from './internal/utils.js';

export interface ButtonProps extends AriaButtonProps {
  variant?: Variant;
  size?: Size;
  ref?: ComponentProps<typeof AriaButton>['ref'];
}
export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <AriaButton
      {...props}
      data-variant={variant}
      data-size={size}
      className={(state) =>
        cx('carved-button', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export interface IconButtonProps extends ButtonProps {
  'aria-label': string;
}
export function IconButton({
  'aria-label': label,
  className,
  variant = 'ghost',
  ...props
}: IconButtonProps) {
  if (!label.trim()) throw new TypeError('IconButton requires a nonempty aria-label');
  return (
    <Button
      {...props}
      aria-label={label}
      variant={variant}
      className={(state) =>
        cx('carved-icon-button', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export interface LinkProps extends AriaLinkProps {
  variant?: Variant | 'link';
  size?: Size;
  ref?: ComponentProps<typeof AriaLink>['ref'];
}
export function Link({ variant = 'link', size = 'md', className, ...props }: LinkProps) {
  return (
    <AriaLink
      {...props}
      data-variant={variant}
      data-size={size}
      className={(state) =>
        cx(
          'carved-link',
          variant !== 'link' && 'carved-button',
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
}
