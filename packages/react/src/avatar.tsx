'use client';
import { useState } from 'react';
import type { ComponentProps } from 'react';
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
