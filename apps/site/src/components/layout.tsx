import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router';
import { Surface } from '@plurid/carved-ui-react';
import { Footer } from './footer';
import { Hydrated, PageError } from './page-state';
import { Header } from './header';
import { DocsNavigation } from './navigation';
import { titleFor } from '../routes';

/** Documentation pages: the contents cut into a channel beside the page. */
export function DocsLayout() {
  const { pathname, hash } = useLocation();
  const navigation = useNavigationType();
  const loaded = useRef(false);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    document.title = titleFor(pathname);
    // The first render keeps the browser's own scroll, and so do back, forward and links to a
    // heading. Moving on to a new page starts at its top, with focus there for assistive
    // technology.
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    if (navigation === 'POP' || hash) return;
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
    // Only a change of page moves the reader.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <div className="docs">
      <Header />
      <div className="docs-body">
        <Surface as="nav" aria-label="Documentation" className="docs-sidebar">
          <DocsNavigation />
        </Surface>
        <main className="docs-main" id="main" tabIndex={-1} ref={main}>
          {/* Pages load lazily inside the shell, so the header and contents never wait. */}
          <PageError page={pathname}>
            <Suspense>
              <Outlet />
              <Hydrated />
            </Suspense>
          </PageError>
        </main>
      </div>
      <Footer />
    </div>
  );
}
