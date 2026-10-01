import type { ReactNode } from 'react';
import { Breadcrumb, Breadcrumbs, Heading, Link, Separator } from '@plurid/carved-ui-react';

/** A page frame: navigation, a trail, a heading and the content. Swap in your router's links. */
export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="recipe-shell">
      <header className="recipe-shell-header">
        <Heading level={2} variant="engraved" className="recipe-brand">
          Quarry
        </Heading>
        <nav aria-label="Workspace" className="recipe-shell-nav">
          <Link href="#projects" variant="ghost" size="sm" aria-current="page">
            Projects
          </Link>
          <Link href="#members" variant="ghost" size="sm">
            Members
          </Link>
          <Link href="#settings" variant="ghost" size="sm">
            Settings
          </Link>
        </nav>
      </header>
      <Separator variant="trench" />
      <main className="recipe-shell-main">
        <Breadcrumbs>
          <Breadcrumb href="#workspace">Workspace</Breadcrumb>
          <Breadcrumb>{title}</Breadcrumb>
        </Breadcrumbs>
        <Heading level={1}>{title}</Heading>
        {children}
      </main>
    </div>
  );
}
