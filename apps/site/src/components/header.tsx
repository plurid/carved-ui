import { useLocation } from 'react-router';
import { Dialog, DialogTrigger, Drawer, IconButton, Link } from '@plurid/carved-ui-react';
import { DocsNavigation } from './navigation';
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

export function Header() {
  const { pathname } = useLocation();
  return (
    <header className="site-header">
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
            aria-current={pathname.startsWith(section.href) ? 'page' : undefined}
          >
            {section.label}
          </Link>
        ))}
      </nav>
      <div className="site-tools">
        <ThemePicker />
        <DialogTrigger>
          <IconButton aria-label="Open the contents" className="contents-button">
            <MenuIcon />
          </IconButton>
          <Drawer placement="start" isDismissable>
            <Dialog aria-label="Contents" className="contents-dialog">
              <ThemePicker />
              <DocsNavigation />
            </Dialog>
          </Drawer>
        </DialogTrigger>
      </div>
    </header>
  );
}
