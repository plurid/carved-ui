import type { ComponentProps, ReactNode } from 'react';
import { Surface } from './provider.js';
import type { SurfaceProps } from './provider.js';
import { cx } from './internal/utils.js';

export function Card({ className, ...props }: SurfaceProps) {
  return <Surface {...props} className={cx('carved-card', className)} />;
}
export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cx('carved-card-header', className)} />;
}
export function CardTitle({ className, ...props }: ComponentProps<'h2'>) {
  return <h2 {...props} className={cx('carved-card-title', className)} />;
}
export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p {...props} className={cx('carved-description', className)} />;
}
export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cx('carved-card-content', className)} />;
}
export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cx('carved-card-footer', className)} />;
}
export interface HeadingProps extends ComponentProps<'h2'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}
export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return <Tag {...props} className={cx('carved-heading', className)} />;
}
export function Separator({ className, ...props }: ComponentProps<'hr'>) {
  return <hr {...props} className={cx('carved-separator', className)} />;
}
export function Badge({
  tone = 'neutral',
  className,
  ...props
}: ComponentProps<'span'> & { tone?: 'neutral' | 'accent' | 'danger' }) {
  return <span {...props} data-tone={tone} className={cx('carved-badge', className)} />;
}
export function Table({ className, ...props }: ComponentProps<'table'>) {
  return <table {...props} className={cx('carved-table', className)} />;
}
export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return <caption {...props} className={cx('carved-table-caption', className)} />;
}
export function TableHead(props: ComponentProps<'thead'>) {
  return <thead {...props} />;
}
export function TableBody(props: ComponentProps<'tbody'>) {
  return <tbody {...props} />;
}
export function TableRow(props: ComponentProps<'tr'>) {
  return <tr {...props} />;
}
export function TableHeader({ scope = 'col', ...props }: ComponentProps<'th'>) {
  return <th {...props} scope={scope} />;
}
export function TableCell(props: ComponentProps<'td'>) {
  return <td {...props} />;
}
export function Pagination({
  'aria-label': label = 'Pagination',
  className,
  ...props
}: ComponentProps<'nav'>) {
  return <nav {...props} aria-label={label} className={cx('carved-pagination', className)} />;
}
export function PaginationLink({
  current,
  className,
  ...props
}: ComponentProps<'a'> & { current?: boolean }) {
  return (
    <a
      {...props}
      aria-current={current ? 'page' : undefined}
      className={cx('carved-pagination-link', className)}
    />
  );
}
export function Alert({
  tone = 'info',
  className,
  ...props
}: ComponentProps<'div'> & { tone?: 'info' | 'success' | 'warning' | 'danger' }) {
  return <div {...props} role="alert" data-tone={tone} className={cx('carved-alert', className)} />;
}
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} aria-hidden="true" className={cx('carved-skeleton', className)} />;
}
export function EmptyState({
  title,
  children,
  action,
  className,
  ...props
}: Omit<ComponentProps<'div'>, 'title'> & { title: ReactNode; action?: ReactNode }) {
  return (
    <div {...props} className={cx('carved-empty-state', className)}>
      <h3>{title}</h3>
      {children}
      {action}
    </div>
  );
}
