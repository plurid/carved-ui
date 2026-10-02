'use client';
import {
  SelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  TabPanels as AriaTabPanels,
  Tabs as AriaTabs,
} from 'react-aria-components/Tabs';
import type {
  TabListProps as AriaTabListProps,
  TabPanelProps as AriaTabPanelProps,
  TabPanelsProps as AriaTabPanelsProps,
  TabProps as AriaTabProps,
  TabsProps as AriaTabsProps,
} from 'react-aria-components/Tabs';
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosurePanel as AriaDisclosurePanel,
  Heading as AriaHeading,
} from 'react-aria-components/DisclosureGroup';
import type {
  DisclosureGroupProps,
  DisclosurePanelProps as AriaDisclosurePanelProps,
  DisclosureProps as AriaDisclosureProps,
} from 'react-aria-components/DisclosureGroup';
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
} from 'react-aria-components/Breadcrumbs';
import type {
  BreadcrumbProps as AriaBreadcrumbProps,
  BreadcrumbsProps as AriaBreadcrumbsProps,
} from 'react-aria-components/Breadcrumbs';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import { Children } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Link as AriaLink } from 'react-aria-components/Link';
import type { LinkProps as AriaLinkProps } from 'react-aria-components/Link';
import { useDepth } from './provider.js';
import { cx, withClass } from './internal/class-names.js';
import { ChevronDown } from './internal/icons.js';

export function Tabs({ className, ...props }: AriaTabsProps & { ref?: Ref<HTMLDivElement> }) {
  return <AriaTabs {...props} className={withClass('carved-tabs', className)} />;
}

/** The carved channel holding the tabs. */
export function TabList<T extends object>({
  className,
  ...props
}: AriaTabListProps<T> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <AriaTabList {...props} className={withClass('carved-tab-list carved-carve', className)} />
  );
}

/** A tab. The selected tab is inlaid, and the inlay slides between tabs. */
export function Tab({
  className,
  children,
  ...props
}: AriaTabProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <AriaTab {...props} className={withClass('carved-tab', className)}>
      {composeRenderProps(children, (content) => (
        <>
          <SelectionIndicator className="carved-tab-indicator carved-carve" />
          <span className="carved-tab-label">{content}</span>
        </>
      ))}
    </AriaTab>
  );
}

export function TabPanels<T extends object>({ className, ...props }: AriaTabPanelsProps<T>) {
  return <AriaTabPanels {...props} className={cx('carved-tab-panels', className)} />;
}

export function TabPanel({
  className,
  ...props
}: AriaTabPanelProps & { ref?: Ref<HTMLDivElement> }) {
  return <AriaTabPanel {...props} className={withClass('carved-tab-panel', className)} />;
}

/** A stack of disclosures. Set `allowsMultipleExpanded` to open several at once. */
export function Accordion({
  className,
  ...props
}: DisclosureGroupProps & { ref?: Ref<HTMLDivElement> }) {
  return <AriaDisclosureGroup {...props} className={withClass('carved-accordion', className)} />;
}

export interface DisclosureRootProps extends AriaDisclosureProps {
  ref?: Ref<HTMLDivElement>;
}

/** The bare disclosure, for arranging its header and panel yourself. */
export function DisclosureRoot({ className, ...props }: DisclosureRootProps) {
  return <AriaDisclosure {...props} className={withClass('carved-disclosure', className)} />;
}

export interface DisclosureHeaderProps {
  children: ReactNode;
  /** The heading level wrapping the trigger, to fit the document outline. @default 3 */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

/** A heading holding the button that expands and collapses its disclosure. */
export function DisclosureHeader({ children, level = 3, className }: DisclosureHeaderProps) {
  return (
    <AriaHeading level={level} className={cx('carved-disclosure-heading', className)}>
      <AriaButton slot="trigger" className="carved-disclosure-trigger">
        <span>{children}</span>
        <ChevronDown className="carved-disclosure-chevron" />
      </AriaButton>
    </AriaHeading>
  );
}

export function DisclosurePanel({
  className,
  ...props
}: AriaDisclosurePanelProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <AriaDisclosurePanel {...props} className={withClass('carved-disclosure-panel', className)} />
  );
}

export interface DisclosureProps extends Omit<DisclosureRootProps, 'children'> {
  /** The always-visible heading that toggles the content. */
  title: ReactNode;
  /** @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: ReactNode;
}

/** A section whose content expands and collapses under its heading. */
export function Disclosure({ title, headingLevel = 3, children, ...props }: DisclosureProps) {
  return (
    <DisclosureRoot {...props}>
      <DisclosureHeader level={headingLevel}>{title}</DisclosureHeader>
      <DisclosurePanel>{children}</DisclosurePanel>
    </DisclosureRoot>
  );
}

/**
 * A trail of places drawn as nested pills: each crumb's pill holds the next one, cut a level
 * deeper, so the current page sits innermost and deepest. Trails of up to eight crumbs nest.
 */
export function Breadcrumbs<T extends object>({
  className,
  style,
  ...props
}: AriaBreadcrumbsProps<T> & { ref?: Ref<HTMLOListElement> }) {
  const depth = useDepth();
  const crumbs = props.items
    ? Array.from(props.items).length
    : Children.toArray(props.children as ReactNode).length;
  // The n-th crumb sits n levels below this surface, down to the deepest level.
  const levels: Record<string, string> = { '--carved-crumb-count': String(Math.min(crumbs, 8)) };
  for (let step = 1; step <= 5; step++) {
    const level = Math.min(depth + step, 5);
    levels[`--carved-crumb-bg-${step}`] = `var(--carved-surface-${level})`;
    levels[`--carved-crumb-fg-${step}`] = `var(--carved-fg-${level})`;
  }
  return (
    <AriaBreadcrumbs
      {...props}
      style={{ ...levels, ...style } as CSSProperties}
      className={cx('carved-breadcrumbs', className)}
    />
  );
}

export interface BreadcrumbProps
  extends Omit<AriaBreadcrumbProps, 'children'>, Pick<AriaLinkProps, 'href' | 'routerOptions'> {
  children: ReactNode;
}

/** One step of the trail. The last breadcrumb is the current page. */
export function Breadcrumb({
  href,
  routerOptions,
  children,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <AriaBreadcrumb {...props} className={withClass('carved-breadcrumb carved-carve', className)}>
      <AriaLink href={href} routerOptions={routerOptions} className="carved-crumb">
        {children}
      </AriaLink>
    </AriaBreadcrumb>
  );
}
