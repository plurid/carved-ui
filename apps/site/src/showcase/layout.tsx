import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Hydrated, PageError } from '../components/page-state';
import { titleFor } from '../routes';

/**
 * The showcase apps: each fills the window with its own frame, so this layout adds nothing
 * around them, only the page title and the loading and failure states every page has.
 */
export function ShowcaseLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = titleFor(pathname);
  }, [pathname]);
  return (
    <PageError page={pathname}>
      <Suspense>
        <Outlet />
        <Hydrated />
      </Suspense>
    </PageError>
  );
}
