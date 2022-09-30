'use client';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { cx } from './internal/utils.js';
export interface AvatarProps extends ComponentProps<'span'> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}
export function Avatar({ name, src, size = 'md', className, ...props }: AvatarProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => [...word][0])
    .join('')
    .toLocaleUpperCase();
  return (
    <span
      {...props}
      className={cx('carved-avatar', className)}
      data-size={size}
      role="img"
      aria-label={name}
    >
      {src && src !== failedSource ? (
        <img src={src} alt="" loading="lazy" onError={() => setFailedSource(src)} />
      ) : (
        initials
      )}
    </span>
  );
}
