'use client';
import type { ReactNode } from 'react';
import {
  AppShell,
  Avatar,
  Breadcrumb,
  Breadcrumbs,
  Heading,
  Sidebar,
  SidebarItem,
  SidebarSection,
} from '@plurid/carved-ui-react';
import type { AppShellProps } from '@plurid/carved-ui-react';

const places = [
  { href: '#projects', label: 'Projects' },
  { href: '#members', label: 'Members' },
  { href: '#billing', label: 'Billing' },
  { href: '#settings', label: 'Settings' },
];

export interface WorkspaceProps extends Omit<AppShellProps, 'header' | 'sidebar' | 'title'> {
  /** The page's heading, and the last step of its trail. */
  title: string;
  /** The place in the sidebar that holds this page. */
  current?: string;
  children: ReactNode;
}

/**
 * A workspace's frame: the product's name and the account in the header, the workspace's
 * places in the sidebar, and the page with its trail and heading. Swap the hrefs for your
 * router's paths; `CarvedProvider`'s `navigate` routes them.
 */
export function Workspace({ title, current = '#projects', children, ...props }: WorkspaceProps) {
  return (
    <AppShell
      {...props}
      header={
        <>
          <Heading level={2} variant="engraved" className="recipe-brand">
            Quarry
          </Heading>
          <Avatar name="Amara Okafor" size="sm" />
        </>
      }
      sidebar={
        <Sidebar aria-label="Workspace">
          <SidebarSection>
            {places.map((place) => (
              <SidebarItem key={place.href} href={place.href} isCurrent={place.href === current}>
                {place.label}
              </SidebarItem>
            ))}
          </SidebarSection>
        </Sidebar>
      }
    >
      <div className="recipe-page">
        <Breadcrumbs>
          <Breadcrumb href="#workspace">Workspace</Breadcrumb>
          <Breadcrumb>{title}</Breadcrumb>
        </Breadcrumbs>
        <Heading level={1}>{title}</Heading>
        {children}
      </div>
    </AppShell>
  );
}
