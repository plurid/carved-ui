'use client';
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
import type { ReactNode, Ref } from 'react';
import { Button, IconButton } from './actions.js';
import { Label } from './fields.js';
import { DepthScope } from './provider.js';
import { withClass } from './internal/class-names.js';
import { Close } from './internal/icons.js';
import { ToneMark } from './content.js';
import type { Tone } from './content.js';

export interface ProgressBarProps extends Omit<AriaProgressBarProps, 'children'> {
  label?: ReactNode;
  /** Show the formatted value beside the label. @default true */
  showValue?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/** Progress of a task, as an inlay filling a carved groove. Omit `value` while it is unknown. */
export function ProgressBar({ label, showValue = true, className, ...props }: ProgressBarProps) {
  return (
    <AriaProgressBar
      {...props}
      isIndeterminate={props.isIndeterminate ?? props.value === undefined}
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
              style={isIndeterminate ? undefined : { inlineSize: `${percentage}%` }}
            />
          </span>
        </>
      )}
    </AriaProgressBar>
  );
}

export interface SpinnerProps extends Omit<AriaProgressBarProps, 'children' | 'isIndeterminate'> {
  /** @default 'md' */
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
