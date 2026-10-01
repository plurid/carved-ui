'use client';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
} from 'react-aria-components/Dialog';
import type { DialogProps as AriaDialogProps, HeadingProps } from 'react-aria-components/Dialog';
import { Modal as AriaModal, ModalOverlay } from 'react-aria-components/Modal';
import type { ModalOverlayProps } from 'react-aria-components/Modal';
import {
  OverlayArrow as AriaOverlayArrow,
  Popover as AriaPopover,
} from 'react-aria-components/Popover';
import type {
  OverlayArrowProps,
  PopoverProps as AriaPopoverProps,
} from 'react-aria-components/Popover';
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
} from 'react-aria-components/Tooltip';
import type { TooltipProps as AriaTooltipProps } from 'react-aria-components/Tooltip';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import { createContext, useCallback, useContext, useEffect, useId, useState } from 'react';
import type { ComponentProps, ReactNode, Ref } from 'react';
import { Button } from './actions.js';
import { DepthScope, useOverlayDepth } from './provider.js';
import { Alert } from './content.js';
import { cx, withClass } from './internal/class-names.js';

export const DialogTrigger = AriaDialogTrigger;
export const TooltipTrigger = AriaTooltipTrigger;

export interface ModalProps extends ModalOverlayProps {
  /** Maximum width of the plate. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

/** A dialog cut into the dimmed page. Contains a `Dialog`. */
export function Modal({ size = 'md', ...props }: ModalProps) {
  return <Plate {...props} base="carved-modal" data-size={size} />;
}

export interface DrawerProps extends ModalOverlayProps {
  /** The edge the drawer slides from. `start` and `end` follow the text direction. @default 'end' */
  placement?: 'start' | 'end' | 'bottom';
}

/** A panel cut into the edge of the viewport. Contains a `Dialog`. */
export function Drawer({ placement = 'end', ...props }: DrawerProps) {
  return <Plate {...props} base="carved-modal carved-drawer" data-placement={placement} />;
}

/** Overlay state goes to the scrim; class, style and content go to the modal, a surface at depth 1. */
function Plate({
  base,
  className,
  style,
  children,
  'data-size': size,
  'data-placement': placement,
  ...overlay
}: ModalOverlayProps & { base: string; 'data-size'?: string; 'data-placement'?: string }) {
  return (
    <ModalOverlay {...overlay} className="carved-scrim">
      <AriaModal
        data-size={size}
        data-placement={placement}
        data-carved-depth={1}
        className={withClass(`${base} carved-carve`, className)}
        style={style}
      >
        {composeRenderProps(children, (content) => (
          <DepthScope depth={1}>{content}</DepthScope>
        ))}
      </AriaModal>
    </ModalOverlay>
  );
}

const DescriptionContext = createContext<((id: string) => () => void) | null>(null);

export interface DialogProps extends AriaDialogProps {
  /** Rendered as the dialog's heading and used as its accessible name. */
  title?: ReactNode;
  /** A short summary below the title, announced when the dialog opens. */
  description?: ReactNode;
}

/** The accessible content of a `Modal`, `Drawer` or `Popover`. */
export function Dialog({ title, description, className, children, ...props }: DialogProps) {
  // React Aria links descriptions only for alert dialogs; register them for every dialog.
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const register = useCallback((id: string) => {
    setDescriptions((current) => (current.includes(id) ? current : [...current, id]));
    return () => setDescriptions((current) => current.filter((value) => value !== id));
  }, []);
  return (
    <DescriptionContext value={register}>
      <AriaDialog
        {...(descriptions.length ? { 'aria-describedby': descriptions.join(' ') } : {})}
        {...props}
        className={cx('carved-dialog', className)}
      >
        {composeRenderProps(children, (content) => (
          <>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
            {content}
          </>
        ))}
      </AriaDialog>
    </DescriptionContext>
  );
}

export function DialogTitle({ className, ...props }: HeadingProps) {
  return <AriaHeading {...props} slot="title" className={cx('carved-dialog-title', className)} />;
}

/** A dialog's description, linked to it for assistive technology. */
export function DialogDescription({ className, id, ...props }: ComponentProps<'p'>) {
  const generated = useId();
  const descriptionId = id ?? generated;
  const register = useContext(DescriptionContext);
  useEffect(() => register?.(descriptionId), [register, descriptionId]);
  return <p {...props} id={descriptionId} className={cx('carved-dialog-description', className)} />;
}

/** The row of actions at the end of a dialog. */
export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cx('carved-dialog-footer', className)} />;
}

export interface AlertDialogProps extends Omit<DialogProps, 'role' | 'children'> {
  title: ReactNode;
  /** The message: what will happen, and whether it can be undone. */
  children?: ReactNode;
  /** `danger` for destructive actions. @default 'danger' */
  tone?: 'accent' | 'danger';
  /** Label of the confirming action, such as "Delete project". */
  actionLabel: string;
  /** @default 'Cancel' */
  cancelLabel?: string;
  /**
   * Runs when the action is confirmed. The dialog closes afterwards; if a promise is returned,
   * it stays open and pending until the promise settles, and stays open if it rejects.
   */
  onAction?: () => void | Promise<void>;
  /** Announced when `onAction` rejects; a function receives the rejection reason. */
  errorMessage?: ReactNode | ((reason: unknown) => ReactNode);
}

/** A modal confirmation that interrupts the user. Place it inside a `Modal`. */
export function AlertDialog({
  title,
  children,
  tone = 'danger',
  actionLabel,
  cancelLabel = 'Cancel',
  onAction,
  errorMessage = 'Something went wrong. Try again.',
  ...props
}: AlertDialogProps) {
  const [isPending, setPending] = useState(false);
  const [failure, setFailure] = useState<{ reason: unknown } | null>(null);
  return (
    <Dialog {...props} role="alertdialog" title={title}>
      {({ close }) => (
        <>
          {children && <DialogDescription>{children}</DialogDescription>}
          {failure && (
            <Alert tone="danger" live="assertive">
              {typeof errorMessage === 'function' ? errorMessage(failure.reason) : errorMessage}
            </Alert>
          )}
          <DialogFooter>
            <Button variant="secondary" slot="close" isDisabled={isPending}>
              {cancelLabel}
            </Button>
            <Button
              variant={tone === 'danger' ? 'danger' : 'primary'}
              isPending={isPending}
              autoFocus
              onPress={async () => {
                setFailure(null);
                const result = onAction?.();
                if (!result) return close();
                setPending(true);
                try {
                  await result;
                  close();
                } catch (reason) {
                  setFailure({ reason });
                } finally {
                  setPending(false);
                }
              }}
            >
              {actionLabel}
            </Button>
          </DialogFooter>
        </>
      )}
    </Dialog>
  );
}

export interface PopoverProps extends AriaPopoverProps {
  /** Point an arrow at the trigger. */
  showArrow?: boolean;
  ref?: Ref<HTMLElement>;
}

/** A well cut beside its trigger, one level deeper than the surface it opens from. */
export function Popover({ showArrow = false, className, children, ...props }: PopoverProps) {
  const depth = useOverlayDepth();
  return (
    <AriaPopover
      offset={showArrow ? 12 : 6}
      {...props}
      data-carved-depth={depth}
      className={withClass('carved-popover carved-carve', className)}
    >
      {composeRenderProps(children, (content) => (
        <DepthScope depth={depth}>
          {showArrow && <OverlayArrow />}
          {content}
        </DepthScope>
      ))}
    </AriaPopover>
  );
}

export function OverlayArrow({ className, ...props }: Omit<OverlayArrowProps, 'children'>) {
  return (
    <AriaOverlayArrow {...props} className={withClass('carved-overlay-arrow', className)}>
      <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden="true">
        <path d="M0 0 L6 6 L12 0" />
      </svg>
    </AriaOverlayArrow>
  );
}

export interface TooltipProps extends AriaTooltipProps {
  showArrow?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/** A short label shown on hover and keyboard focus. Place inside a `TooltipTrigger`. */
export function Tooltip({ showArrow = false, className, children, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      offset={showArrow ? 10 : 6}
      {...props}
      data-carved-depth={useOverlayDepth()}
      className={withClass('carved-tooltip carved-carve', className)}
    >
      {composeRenderProps(children, (content) => (
        <>
          {showArrow && <OverlayArrow />}
          {content}
        </>
      ))}
    </AriaTooltip>
  );
}
