import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Surface } from '@plurid/carved-ui-react';
import { Footer } from './footer';
import { Header } from './header';
import { DocsNavigation } from './navigation';
import { titleFor } from '../routes';

/** Documentation pages: the contents cut into a channel beside the page. */
export function DocsLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = titleFor(pathname);
  }, [pathname]);
  return (
    <div className="docs">
      <Header />
      <div className="docs-body">
        <Surface as="nav" aria-label="Documentation" className="docs-sidebar">
          <DocsNavigation />
        </Surface>
        <main className="docs-main" id="main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
