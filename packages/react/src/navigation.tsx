'use client';
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
} from 'react-aria-components/Tabs';
import {
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  DisclosureGroup as AriaDisclosureGroup,
} from 'react-aria-components/DisclosureGroup';
import {
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb as AriaBreadcrumb,
} from 'react-aria-components/Breadcrumbs';
import type { ComponentProps } from 'react';
import type { TabListProps, BreadcrumbsProps } from 'react-aria-components';
import { cx } from './internal/utils.js';

export function Tabs({ className, ...props }: ComponentProps<typeof AriaTabs>) {
  return (
    <AriaTabs
      {...props}
      className={(state) =>
        cx('carved-tabs', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      className={(state) =>
        cx('carved-tab-list', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function Tab({ className, ...props }: ComponentProps<typeof AriaTab>) {
  return (
    <AriaTab
      {...props}
      className={(state) =>
        cx('carved-tab', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function TabPanel({ className, ...props }: ComponentProps<typeof AriaTabPanel>) {
  return (
    <AriaTabPanel
      {...props}
      className={(state) =>
        cx('carved-tab-panel', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function Accordion({ className, ...props }: ComponentProps<typeof AriaDisclosureGroup>) {
  return (
    <AriaDisclosureGroup
      {...props}
      className={(state) =>
        cx('carved-accordion', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function AccordionItem({ className, ...props }: ComponentProps<typeof AriaDisclosure>) {
  return (
    <AriaDisclosure
      {...props}
      className={(state) =>
        cx('carved-accordion-item', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function AccordionPanel({
  className,
  ...props
}: ComponentProps<typeof AriaDisclosurePanel>) {
  return (
    <AriaDisclosurePanel
      {...props}
      className={(state) =>
        cx('carved-accordion-panel', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function Breadcrumbs<T extends object>({ className, ...props }: BreadcrumbsProps<T>) {
  return <AriaBreadcrumbs {...props} className={cx('carved-breadcrumbs', className)} />;
}
export function Breadcrumb({ className, ...props }: ComponentProps<typeof AriaBreadcrumb>) {
  return (
    <AriaBreadcrumb
      {...props}
      className={(state) =>
        cx('carved-breadcrumb', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
