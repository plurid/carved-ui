'use client';
import { Children, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from './internal/class-names.js';

export interface AvatarProps extends ComponentProps<'span'> {
  /** The person's name: the accessible label, and the source of the initials. */
  name: string;
  /** An image URL. Initials are shown until it loads, and if it fails. */
  src?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

/** A portrait set into a round socket, falling back to initials. */
export function Avatar({ name, src, size = 'md', className, ...props }: AvatarProps) {
  const [failed, setFailed] = useState<string | null>(null);
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => [...word][0] ?? '')
    .join('')
    .toLocaleUpperCase();
  return (
    <span
      {...props}
      role="img"
      aria-label={name}
      data-size={size}
      className={cx('carved-avatar carved-carve', className)}
    >
      <span className="carved-avatar-initials" aria-hidden="true">
        {initials}
      </span>
      {src && src !== failed && (
        <img src={src} alt="" loading="lazy" onError={() => setFailed(src)} />
      )}
    </span>
  );
}

export interface AvatarGroupProps extends ComponentProps<'div'> {
  /** `Avatar`s. */
  children: ReactNode;
  /** The most avatars to show; the rest are counted in a final socket. */
  max?: number;
  /** The size of every avatar in the group. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Names the count of hidden people. @default (count) => `${count} more` */
  moreLabel?: (count: number) => string;
}

/** People shown together: avatars overlapping in a row, then a count of the rest. */
export function AvatarGroup({
  children,
  max,
  size = 'md',
  moreLabel = (count) => `${count} more`,
  className,
  ...props
}: AvatarGroupProps) {
  const avatars = Children.toArray(children);
  const shown = max === undefined ? avatars : avatars.slice(0, Math.max(max, 0));
  const hidden = avatars.length - shown.length;
  return (
    <div role="group" {...props} data-size={size} className={cx('carved-avatar-group', className)}>
      {shown}
      {hidden > 0 && (
        <span
          role="img"
          aria-label={moreLabel(hidden)}
          className="carved-avatar carved-avatar-more carved-carve"
        >
          <span aria-hidden="true">+{hidden}</span>
        </span>
      )}
    </div>
  );
}
