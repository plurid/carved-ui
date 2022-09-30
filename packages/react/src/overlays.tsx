'use client';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
} from 'react-aria-components/Dialog';
import { Modal as AriaModal, ModalOverlay as AriaModalOverlay } from 'react-aria-components/Modal';
import {
  Popover as AriaPopover,
  OverlayArrow as AriaOverlayArrow,
} from 'react-aria-components/Popover';
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
} from 'react-aria-components/Tooltip';
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from 'react';
import type { ComponentProps } from 'react';
import { cx } from './internal/utils.js';
import { useOverlayStyle } from './provider.js';

export const DialogTrigger = AriaDialogTrigger;
export const TooltipTrigger = AriaTooltipTrigger;
const DescriptionContext = createContext<((id: string) => () => void) | null>(null);
export function Dialog({ className, ...props }: ComponentProps<typeof AriaDialog>) {
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const register = useCallback((id: string) => {
    setDescriptions((current) => (current.includes(id) ? current : [...current, id]));
    return () => setDescriptions((current) => current.filter((value) => value !== id));
  }, []);
  const describedBy = useMemo(() => descriptions.join(' ') || undefined, [descriptions]);
  return (
    <DescriptionContext value={register}>
      <AriaDialog
        {...(describedBy ? { 'aria-describedby': describedBy } : {})}
        {...props}
        className={cx('carved-dialog', className)}
      />
    </DescriptionContext>
  );
}
export function AlertDialog(props: ComponentProps<typeof AriaDialog>) {
  return <Dialog {...props} role="alertdialog" />;
}
export function DialogContent({ className, style, ...props }: ComponentProps<typeof AriaModal>) {
  const tokens = useOverlayStyle();
  const controlKeys = [
    'isOpen',
    'defaultOpen',
    'onOpenChange',
    'isDismissable',
    'isKeyboardDismissDisabled',
    'shouldCloseOnInteractOutside',
    'UNSTABLE_portalContainer',
    'isEntering',
    'isExiting',
  ] as const;
  const controls = Object.fromEntries(
    controlKeys.filter((key) => props[key] !== undefined).map((key) => [key, props[key]]),
  );
  return (
    <AriaModalOverlay {...controls} className="carved-overlay" style={tokens}>
      <AriaModal
        {...props}
        className={(state) =>
          cx('carved-modal', typeof className === 'function' ? className(state) : className)
        }
        style={(state) => ({ ...tokens, ...(typeof style === 'function' ? style(state) : style) })}
      />
    </AriaModalOverlay>
  );
}
export function Drawer({
  placement = 'end',
  className,
  ...props
}: ComponentProps<typeof AriaModal> & { placement?: 'start' | 'end' | 'bottom' }) {
  return (
    <DialogContent
      {...props}
      data-placement={placement}
      className={(state) =>
        cx('carved-drawer', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function DialogTitle({ className, ...props }: ComponentProps<typeof AriaHeading>) {
  return <AriaHeading {...props} slot="title" className={cx('carved-dialog-title', className)} />;
}
export function DialogDescription({ className, id, ...props }: ComponentProps<'p'>) {
  const generated = useId();
  const descriptionId = id ?? generated;
  const register = useContext(DescriptionContext);
  useEffect(() => register?.(descriptionId), [register, descriptionId]);
  return <p {...props} id={descriptionId} className={cx('carved-description', className)} />;
}
export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cx('carved-dialog-footer', className)} />;
}
export function Popover({ className, style, ...props }: ComponentProps<typeof AriaPopover>) {
  const tokens = useOverlayStyle();
  return (
    <AriaPopover
      {...props}
      className={(state) =>
        cx('carved-popover', typeof className === 'function' ? className(state) : className)
      }
      style={(state) => ({ ...tokens, ...(typeof style === 'function' ? style(state) : style) })}
    />
  );
}
export const OverlayArrow = AriaOverlayArrow;
export function Tooltip({ className, style, ...props }: ComponentProps<typeof AriaTooltip>) {
  const tokens = useOverlayStyle();
  return (
    <AriaTooltip
      {...props}
      className={(state) =>
        cx('carved-tooltip', typeof className === 'function' ? className(state) : className)
      }
      style={(state) => ({ ...tokens, ...(typeof style === 'function' ? style(state) : style) })}
    />
  );
}
