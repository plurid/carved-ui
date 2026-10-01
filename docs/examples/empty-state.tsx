import type { ReactNode } from 'react';
import { Heading, Surface } from '@plurid/carved-ui-react';

/** A quiet well for an empty list: what is missing, and what to do about it. */
export function EmptyState({
  title,
  children,
  action,
}: {
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Surface className="recipe-empty">
      <Heading level={3}>{title}</Heading>
      {children && <p>{children}</p>}
      {action}
    </Surface>
  );
}
