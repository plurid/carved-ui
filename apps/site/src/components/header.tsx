import { useState } from 'react';
import { useLocation } from 'react-router';
import { Dialog, DialogTrigger, Drawer, IconButton, Link } from '@plurid/carved-ui-react';
import { DocsNavigation } from './navigation';
import { preloadPath } from '../prefetch';
import { canonical } from '../routes';
import { ThemePicker } from './theme-picker';

const sections = [
  { href: '/start', label: 'Start' },
  { href: '/material', label: 'Material' },
  { href: '/themes', label: 'Themes' },
  { href: '/components', label: 'Components' },
];

const MenuIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export function Header() {
  const pathname = canonical(useLocation().pathname);
  // The contents drawer closes once a page in it has been chosen.
  const [contentsOpen, setContentsOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  if (pathname !== openedAt) {
    setOpenedAt(pathname);
    setContentsOpen(false);
  }
  return (
    <header className="site-header">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Link href="/" className="wordmark" aria-label="Carved, home">
        <span className="carved-engrave" aria-hidden="true">
          Carved
        </span>
      </Link>
      <nav aria-label="Sections" className="site-sections">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            variant="ghost"
            size="sm"
            // The section's own page is current; within the section, the link is still a way back.
            aria-current={
              pathname === section.href
                ? 'page'
                : pathname.startsWith(`${section.href}/`)
                  ? 'true'
                  : undefined
            }
            onHoverStart={() => preloadPath(section.href)}
            onFocus={() => preloadPath(section.href)}
          >
            {section.label}
          </Link>
        ))}
      </nav>
      <div className="site-tools">
        <ThemePicker />
        <DialogTrigger isOpen={contentsOpen} onOpenChange={setContentsOpen}>
          <IconButton aria-label="Open the contents" className="contents-button">
            <MenuIcon />
          </IconButton>
          <Drawer placement="start" isDismissable>
            <Dialog aria-label="Contents" className="contents-dialog">
              <div className="contents-head">
                <ThemePicker />
                <IconButton slot="close" aria-label="Close the contents">
                  <CloseIcon />
                </IconButton>
              </div>
              <DocsNavigation />
            </Dialog>
          </Drawer>
        </DialogTrigger>
      </div>
    </header>
  );
}
