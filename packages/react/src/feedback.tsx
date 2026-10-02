'use client';
import { useMeter } from 'react-aria/useMeter';
import type { AriaMeterProps } from 'react-aria/useMeter';
import { ProgressBar as AriaProgressBar } from 'react-aria-components/ProgressBar';
import type { ProgressBarProps as AriaProgressBarProps } from 'react-aria-components/ProgressBar';
import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from 'react-aria-components/Toast';
import type { ToastRegionProps as AriaToastRegionProps } from 'react-aria-components/Toast';
import { Text } from 'react-aria-components/Text';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Button, IconButton } from './actions.js';
import { Label } from './fields.js';
import { DepthScope } from './provider.js';
import { cx, withClass } from './internal/class-names.js';
import { Close } from './internal/icons.js';
import { ToneMark } from './content.js';
import type { Tone } from './content.js';

/**
 * The bead's length for a value: at least its own height once there is any value, growing to
 * fill the slot at 100%, so the end of the bead travels as a slider's knob does.
 */
function beadSize(fraction: number): string {
  if (!(fraction > 0)) return '0';
  return `calc(var(--carved-slot-bead) + (100% - var(--carved-slot-bead)) * ${Math.min(fraction, 1)})`;
}

export interface ProgressBarProps extends Omit<AriaProgressBarProps, 'children'> {
  /** Names the task, above the bar. */
  label?: ReactNode;
  /** Show the formatted value beside the label. @default true */
  showValue?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Progress of a task: an inlaid bead growing along a carved slot, the slider's instrument
 * without a knob. Omit `value` while it is unknown.
 */
export function ProgressBar({ label, showValue = true, className, ...props }: ProgressBarProps) {
  const indeterminate = props.isIndeterminate ?? props.value === undefined;
  return (
    <AriaProgressBar
      {...props}
      isIndeterminate={indeterminate}
      // React Aria exposes this only as a render prop; the stylesheet needs it on the element.
      data-indeterminate={indeterminate || undefined}
      className={withClass('carved-progress', className)}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          {label && <Label>{label}</Label>}
          {showValue && !isIndeterminate && (
            <span className="carved-progress-value">{valueText}</span>
          )}
          <span className="carved-progress-track carved-carve">
            <span
              className="carved-progress-fill"
              style={
                isIndeterminate ? undefined : { inlineSize: beadSize((percentage ?? 0) / 100) }
              }
            />
          </span>
        </>
      )}
    </AriaProgressBar>
  );
}

export interface MeterProps extends AriaMeterProps {
  /** Names the quantity, above the bar. */
  label?: ReactNode;
  /** Show the formatted value beside the label. @default true */
  showValue?: boolean;
  /** The inlay's tone, such as `warning` when storage runs low. @default 'accent' */
  tone?: Exclude<Tone, 'neutral'>;
  /** Classes for the meter. */
  className?: string;
  /** Styles for the meter. */
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A quantity within a known range, such as storage used: a bead in a carved slot, like a
 * progress bar's. Unlike a
 * progress bar, it measures an amount rather than a task.
 */
export function Meter({
  label,
  showValue = true,
  tone = 'accent',
  className,
  style,
  ref,
  ...props
}: MeterProps) {
  const { meterProps, labelProps } = useMeter({ ...props, label });
  const { value = 0, minValue = 0, maxValue = 100 } = props;
  const range = maxValue - minValue;
  const percentage =
    range > 0 ? (Math.min(Math.max(value, minValue), maxValue) - minValue) / range : 0;
  return (
    <div
      {...meterProps}
      // React Aria falls back to `progressbar` for old browsers; every supported one has `meter`.
      role="meter"
      ref={ref}
      style={style}
      data-tone={tone}
      className={cx('carved-progress carved-meter', className)}
    >
      {label && (
        <span {...labelProps} className="carved-label">
          {label}
        </span>
      )}
      {showValue && <span className="carved-progress-value">{meterProps['aria-valuetext']}</span>}
      <span className="carved-progress-track carved-carve">
        <span className="carved-progress-fill" style={{ inlineSize: beadSize(percentage) }} />
      </span>
    </div>
  );
}

export interface SpinnerProps extends Omit<AriaProgressBarProps, 'children' | 'isIndeterminate'> {
  /** The spinner's diameter. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  ref?: Ref<HTMLDivElement>;
}

/** An indeterminate activity indicator, announced as "Loading" unless labelled otherwise. */
export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  return (
    <AriaProgressBar
      aria-label="Loading"
      {...props}
      isIndeterminate
      data-size={size}
      className={withClass('carved-spinner carved-carve', className)}
    />
  );
}

export interface ToastContent {
  title: ReactNode;
  description?: ReactNode;
  /** @default 'neutral' */
  tone?: Tone;
  /** One follow-up action, such as "Undo". */
  action?: { label: string; onAction: () => void };
}

/**
 * The toasts of one application. Create one queue, render it with a `ToastRegion`, and call
 * `queue.add({ title })` from anywhere. Keep errors that need attention on the page instead.
 */
export class ToastQueue extends AriaToastQueue<ToastContent> {}

export interface ToastRegionProps extends Omit<AriaToastRegionProps<ToastContent>, 'children'> {
  ref?: Ref<HTMLDivElement>;
}

/** Where toasts from a queue appear: wells cut into the corner of the viewport. */
export function ToastRegion({ className, ...props }: ToastRegionProps) {
  return (
    <AriaToastRegion {...props} className={withClass('carved-toast-region', className)}>
      {({ toast }) => {
        const { title, description, tone = 'neutral', action } = toast.content;
        return (
          <AriaToast
            toast={toast}
            data-tone={tone}
            data-carved-depth={1}
            className="carved-toast carved-carve"
          >
            <DepthScope depth={1}>
              <ToneMark tone={tone} />
              <AriaToastContent className="carved-toast-content">
                <Text slot="title" className="carved-toast-title">
                  {title}
                </Text>
                {description && (
                  <Text slot="description" className="carved-toast-description">
                    {description}
                  </Text>
                )}
              </AriaToastContent>
              {action && (
                <Button
                  size="sm"
                  variant="secondary"
                  onPress={() => {
                    action.onAction();
                    props.queue.close(toast.key);
                  }}
                >
                  {action.label}
                </Button>
              )}
              <IconButton slot="close" size="sm" aria-label="Dismiss">
                <Close />
              </IconButton>
            </DepthScope>
          </AriaToast>
        );
      }}
    </AriaToastRegion>
  );
}
