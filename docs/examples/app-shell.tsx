import type { ReactNode } from 'react';
import { Heading, Link, Separator } from '@plurid/carved-ui-react';

/** Pass router-aware links or edit these native links in the consuming app. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="example-shell">
      <header>
        <Heading level={1}>Workspace</Heading>
        <nav aria-label="Workspace">
          <Link href="#projects" aria-current="page">
            Projects
          </Link>
          <Link href="#settings">Settings</Link>
        </nav>
      </header>
      <Separator />
      <section aria-label="Projects">{children}</section>
    </div>
  );
}
