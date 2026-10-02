import { Component, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Alert, Button } from '@plurid/carved-ui-react';
import { paths } from '../routes';
import { preloadAll } from '../prefetch';

/**
 * Marks the page interactive for the browser tests, then fetches the other pages while the
 * browser is idle. It sits inside the page's Suspense boundary, so it runs only once the
 * page, which may load lazily, has hydrated too.
 */
export function Hydrated() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = '';
    preloadAll(paths);
  }, []);
  return null;
}

interface PageErrorProps {
  children: ReactNode;
  /** The page shown: moving to another one clears a failure. */
  page?: string;
}

/**
 * Catches a page that fails to load, such as a chunk that a new deploy replaced, and offers a
 * reload instead of a blank screen. It stays mounted across pages, so the page's Suspense
 * boundary does too, and navigation keeps the current page until the next has loaded.
 */
export class PageError extends Component<PageErrorProps, { failed: boolean; page?: string }> {
  override state = { failed: false, page: this.props.page };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  static getDerivedStateFromProps(props: PageErrorProps, state: { page?: string }) {
    return props.page === state.page ? null : { failed: false, page: props.page };
  }

  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="page">
        <Alert
          tone="danger"
          live="assertive"
          title="This page could not be loaded"
          action={<Button onPress={() => window.location.reload()}>Reload</Button>}
        >
          The site may have been updated since it was opened. Reloading fetches the latest version.
        </Alert>
      </div>
    );
  }
}
