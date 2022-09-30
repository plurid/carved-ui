'use client';
import { ProgressBar as AriaProgressBar } from 'react-aria-components/ProgressBar';
import {
  UNSTABLE_ToastRegion as AriaToastRegion,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
} from 'react-aria-components/Toast';
import type { ComponentProps } from 'react';
import { cx } from './internal/utils.js';
import { useOverlayStyle } from './provider.js';

export function Progress({
  className,
  children,
  ...props
}: ComponentProps<typeof AriaProgressBar>) {
  return (
    <AriaProgressBar
      {...props}
      className={(state) =>
        cx('carved-progress', typeof className === 'function' ? className(state) : className)
      }
    >
      {(state) => (
        <>
          {typeof children === 'function' ? children(state) : children}
          <span className="carved-progress-track">
            <span
              className="carved-progress-fill"
              style={{ width: state.isIndeterminate ? '35%' : `${state.percentage}%` }}
            />
          </span>
        </>
      )}
    </AriaProgressBar>
  );
}
export function Spinner({
  className,
  'aria-label': label = 'Loading',
  ...props
}: Omit<ComponentProps<typeof AriaProgressBar>, 'children'>) {
  return (
    <AriaProgressBar
      {...props}
      aria-label={label}
      isIndeterminate
      className={(state) =>
        cx('carved-spinner', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
/** Create one queue per application/provider; no process-wide singleton during SSR. */
export const ToastQueue = AriaToastQueue;
export function ToastRegion<T extends object>({
  className,
  style,
  ...props
}: ComponentProps<typeof AriaToastRegion<T>>) {
  const tokens = useOverlayStyle();
  return (
    <AriaToastRegion
      {...props}
      className={(state) =>
        cx('carved-toast-region', typeof className === 'function' ? className(state) : className)
      }
      style={(state) => ({ ...tokens, ...(typeof style === 'function' ? style(state) : style) })}
    />
  );
}
export function Toast<T extends object>({
  className,
  ...props
}: ComponentProps<typeof AriaToast<T>>) {
  return (
    <AriaToast
      {...props}
      className={(state) =>
        cx('carved-toast', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function ToastContent({ className, ...props }: ComponentProps<typeof AriaToastContent>) {
  return <AriaToastContent {...props} className={cx('carved-toast-content', className)} />;
}
export { Text } from 'react-aria-components/Text';
