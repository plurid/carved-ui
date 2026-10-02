'use client';
import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { Link as AriaLink } from 'react-aria-components/Link';
import type { LinkProps as AriaLinkProps } from 'react-aria-components/Link';
import { IconButton } from './actions.js';
import { Dialog, Drawer } from './overlays.js';
import { DepthScope, useCutDepth } from './provider.js';
import { cx, withClass } from './internal/class-names.js';
import { Close, MenuIcon } from './internal/icons.js';

interface Placement {
  /** Where the sidebar is shown: beside the content, or in the drawer of a narrow shell. */
  placement: 'inline' | 'drawer';
  /** Closes the drawer, after an item in it is chosen. */
  close?: () => void;
}

const PlacementContext = createContext<Placement>({ placement: 'inline' });

export interface AppShellProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The bar across the top, such as your product's name, a search field and an account menu. */
  header?: ReactNode;
  /** The navigation: a `Sidebar`. It sits beside the content, or in a drawer when narrow. */
  sidebar?: ReactNode;
  /** The page's content. It scrolls on its own, below the header. */
  children?: ReactNode;
  /**
   * The width below which the sidebar moves into a drawer, opened with a menu button: `sm`
   * below 40rem, `md` below 56rem, `lg` below 72rem. It is the shell's own width, not the
   * window's, so a shell in a narrow column collapses too.
   * @default 'md'
   */
  collapse?: 'sm' | 'md' | 'lg';
  /**
   * Render the page's landmarks and a skip link. Turn off for a shell shown inside a page that
   * has them already, such as a preview.
   * @default true
   */
  landmarks?: boolean;
  /** The skip link's text: it moves focus past the header and navigation. @default 'Skip to content' */
  skipLabel?: string;
  /** Names the menu button that opens the navigation when narrow. @default 'Open navigation' */
  menuLabel?: string;
  /** Names the navigation drawer. @default 'Navigation' */
  drawerLabel?: string;
  /** Names the drawer's close button. @default 'Close navigation' */
  closeLabel?: string;
}

/**
 * The frame of an application: a header, a sidebar of navigation and the content beside it,
 * filling the window. When the shell is narrow, the sidebar moves into a drawer opened from the
 * header, and choosing a place in it closes the drawer.
 */
export function AppShell({
  header,
  sidebar,
  children,
  collapse = 'md',
  landmarks = true,
  skipLabel = 'Skip to content',
  menuLabel = 'Open navigation',
  drawerLabel = 'Navigation',
  closeLabel = 'Close navigation',
  className,
  ...props
}: AppShellProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);
  const mainId = useId();
  const Main = landmarks ? 'main' : 'div';
  const Header = landmarks ? 'header' : 'div';

  // When the shell widens past its breakpoint, the sidebar is back in view: close the drawer.
  useEffect(() => {
    const element = root.current;
    if (!open || !element) return;
    const observer = new ResizeObserver(() => {
      const menu = element.querySelector<HTMLElement>('.carved-shell-menu');
      if (menu && getComputedStyle(menu).display === 'none') setOpen(false);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [open]);

  return (
    <div {...props} ref={root} data-collapse={collapse} className={cx('carved-shell', className)}>
      <div className="carved-shell-frame">
        {landmarks && (
          <a
            href={`#${mainId}`}
            className="carved-skip-link"
            onClick={(event) => {
              event.preventDefault();
              main.current?.focus();
            }}
          >
            {skipLabel}
          </a>
        )}
        {(header || sidebar) && (
          <Header className="carved-shell-header">
            {sidebar && (
              <IconButton
                aria-label={menuLabel}
                aria-expanded={open}
                className="carved-shell-menu"
                onPress={() => setOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            {header}
          </Header>
        )}
        {sidebar && <div className="carved-shell-sidebar">{sidebar}</div>}
        <Main ref={main} id={mainId} tabIndex={-1} className="carved-shell-main">
          {children}
        </Main>
      </div>
      {sidebar && (
        <Drawer placement="start" isOpen={open} onOpenChange={setOpen} isDismissable>
          <Dialog aria-label={drawerLabel} className="carved-shell-drawer">
            <div className="carved-shell-drawer-head">
              <IconButton slot="close" aria-label={closeLabel}>
                <Close />
              </IconButton>
            </div>
            <PlacementContext value={{ placement: 'drawer', close: () => setOpen(false) }}>
              {sidebar}
            </PlacementContext>
          </Dialog>
        </Drawer>
      )}
    </div>
  );
}

export type SidebarProps = ComponentProps<'nav'>;

/**
 * The navigation of an `AppShell`: a well holding `SidebarSection`s of places, and anything
 * else that belongs beside them, such as an account or a storage meter. Give it an
 * `aria-label`.
 */
export function Sidebar({ className, children, ...props }: SidebarProps) {
  const { placement } = useContext(PlacementContext);
  const depth = useCutDepth();
  // In the drawer, the drawer is the well already.
  if (placement === 'drawer')
    return (
      <nav {...props} data-placement="drawer" className={cx('carved-sidebar', className)}>
        {children}
      </nav>
    );
  return (
    <nav
      {...props}
      data-carved-depth={depth}
      data-placement="inline"
      className={cx('carved-sidebar carved-carve', className)}
    >
      <DepthScope depth={depth}>{children}</DepthScope>
    </nav>
  );
}

export interface SidebarSectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  /** The group's heading, such as "Projects". Leave it out for a group of places without one. */
  title?: ReactNode;
  /** The heading's level, to fit the page's outline. @default 2 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** The group's `SidebarItem`s. */
  children?: ReactNode;
}

/** A group of places in a `Sidebar`, under an optional heading. */
export function SidebarSection({
  title,
  headingLevel = 2,
  children,
  className,
  ...props
}: SidebarSectionProps) {
  const id = useId();
  const Heading = `h${headingLevel}` as const;
  return (
    <section
      {...props}
      aria-labelledby={title ? id : undefined}
      className={cx('carved-sidebar-section', className)}
    >
      {title && (
        <Heading id={id} className="carved-sidebar-title">
          {title}
        </Heading>
      )}
      <ul className="carved-sidebar-list">{children}</ul>
    </section>
  );
}

export interface SidebarItemProps extends Omit<AriaLinkProps, 'children'> {
  /** A small icon before the label. */
  icon?: ReactNode;
  /** Shown at the end, such as a count of unread messages. */
  count?: ReactNode;
  /** Whether this is the place you are on. It is cut into the sidebar, and announced so. */
  isCurrent?: boolean;
  /** The label. */
  children: ReactNode;
}

/**
 * A place in a `SidebarSection`: a link through your router, set up with `CarvedProvider`'s
 * `navigate`. The current place is cut a level deeper.
 */
export function SidebarItem({
  icon,
  count,
  isCurrent = false,
  children,
  className,
  onPress,
  ...props
}: SidebarItemProps) {
  const { close } = useContext(PlacementContext);
  return (
    <li className="carved-sidebar-entry">
      <AriaLink
        {...props}
        aria-current={isCurrent ? 'page' : undefined}
        onPress={(event) => {
          onPress?.(event);
          close?.();
        }}
        className={withClass('carved-sidebar-item carved-carve', className)}
      >
        {icon && (
          <span className="carved-sidebar-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="carved-sidebar-label">{children}</span>
        {count !== undefined && count !== null && (
          <span className="carved-sidebar-count">{count}</span>
        )}
      </AriaLink>
    </li>
  );
}
