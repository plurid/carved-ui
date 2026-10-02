// Static content: safe to render in React Server Components, so no hooks and no React Aria.
import type { ComponentProps, ReactNode } from 'react';
import { cx } from './internal/cx.js';
import { Danger, Info, Success, Warning } from './internal/icons.js';

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface HeadingProps extends ComponentProps<'h2'> {
  /** The heading level, 1–6. Choose it for the document outline, not the size. @default 2 */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * `display` sets a large, tight headline. `engraved` cuts uppercase display letters into the
   * surface, after the original Carved headings.
   * @default 'default'
   */
  variant?: 'default' | 'display' | 'engraved';
}

/** A heading at a level of the document outline, in one of three styles. */
export function Heading({ level = 2, variant = 'default', className, ...props }: HeadingProps) {
  const Element = `h${level}` as const;
  return (
    <Element
      {...props}
      data-variant={variant}
      className={cx('carved-heading', variant === 'engraved' && 'carved-engrave', className)}
    />
  );
}

export interface SeparatorProps extends ComponentProps<'hr'> {
  /** `trench` cuts a wide carved channel between regions. @default 'line' */
  variant?: 'line' | 'trench';
  /** Horizontal divides stacked content; vertical divides content side by side. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

/** A divider between pieces of content: a fine carved line, or a wide trench between regions. */
export function Separator({
  variant = 'line',
  orientation = 'horizontal',
  className,
  ...props
}: SeparatorProps) {
  return (
    <hr
      {...props}
      aria-orientation={orientation}
      data-variant={variant}
      className={cx(
        'carved-separator',
        variant === 'trench' && 'carved-carve carved-trench',
        className,
      )}
    />
  );
}

export interface BadgeProps extends ComponentProps<'span'> {
  /** The meaning the badge is inlaid with. @default 'neutral' */
  tone?: Tone;
}

/** A short status label, inlaid with its tone. */
export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      data-tone={tone}
      className={cx('carved-badge carved-inlay carved-carve', className)}
    />
  );
}

const toneIcons = {
  neutral: Info,
  accent: Info,
  success: Success,
  warning: Warning,
  danger: Danger,
};

/** A tone's icon set into a small round inlay: how alerts and toasts carry their meaning. */
export function ToneMark({ tone, className }: { tone: Tone; className?: string }) {
  const Icon = toneIcons[tone];
  return (
    <span
      aria-hidden="true"
      data-tone={tone}
      className={cx('carved-tone-mark carved-inlay carved-carve', className)}
    >
      <Icon />
    </span>
  );
}

export interface AlertProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** The meaning the alert is marked with. @default 'neutral' */
  tone?: Tone;
  /** A short headline, above the message. */
  title?: ReactNode;
  /** An action placed at the end, such as a retry button. */
  action?: ReactNode;
  /**
   * Announce the alert when it appears: `polite` waits for a pause, `assertive` interrupts.
   * Leave unset for messages present when the page loads.
   */
  live?: 'polite' | 'assertive';
}

/** A message cut into the page, marked by its tone's inlay. */
export function Alert({
  tone = 'neutral',
  title,
  action,
  live,
  className,
  children,
  ...props
}: AlertProps) {
  const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined;
  return (
    <div
      role={role}
      {...props}
      data-tone={tone}
      className={cx('carved-alert carved-carve', className)}
    >
      <ToneMark tone={tone} />
      <div className="carved-alert-body">
        {title && <p className="carved-alert-title">{title}</p>}
        {children && <div className="carved-alert-message">{children}</div>}
      </div>
      {action && <div className="carved-alert-action">{action}</div>}
    </div>
  );
}

/** A carved placeholder for content that is still loading. Hidden from assistive technology. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div aria-hidden="true" {...props} className={cx('carved-skeleton carved-carve', className)} />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cx('carved-card-header', className)} />;
}

export function CardTitle({
  level = 3,
  className,
  ...props
}: ComponentProps<'h3'> & { level?: 2 | 3 | 4 | 5 | 6 }) {
  const Element = `h${level}` as const;
  return <Element {...props} className={cx('carved-card-title', className)} />;
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p {...props} className={cx('carved-card-description', className)} />;
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cx('carved-card-content', className)} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cx('carved-card-footer', className)} />;
}

/** A native table, cut into its own well. It scrolls horizontally when space runs out. */
export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div className="carved-table-well carved-carve">
      <table {...props} className={cx('carved-table', className)} />
    </div>
  );
}

export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return <caption {...props} className={cx('carved-table-caption', className)} />;
}

export const TableHead = (props: ComponentProps<'thead'>) => <thead {...props} />;
export const TableBody = (props: ComponentProps<'tbody'>) => <tbody {...props} />;
export const TableRow = (props: ComponentProps<'tr'>) => <tr {...props} />;
export const TableCell = (props: ComponentProps<'td'>) => <td {...props} />;
/** A header cell. Column scope by default; use `scope="row"` for row headers. */
export const TableHeader = ({ scope = 'col', ...props }: ComponentProps<'th'>) => (
  <th scope={scope} {...props} />
);

/** A key or combination, such as `⌘K`, set on a raised keycap: keys are pieces that move. */
export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return <kbd {...props} className={cx('carved-kbd carved-raise', className)} />;
}

export interface FieldsetProps extends ComponentProps<'fieldset'> {
  /** Names the group of fields. */
  legend?: ReactNode;
}

/** A named group of related fields, such as an address. */
export function Fieldset({ legend, className, children, ...props }: FieldsetProps) {
  return (
    <fieldset {...props} className={cx('carved-fieldset', className)}>
      {legend && <legend className="carved-fieldset-legend">{legend}</legend>}
      {children}
    </fieldset>
  );
}
