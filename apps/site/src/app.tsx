import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useHref, useNavigate } from 'react-router';
import type { NavigateOptions } from 'react-router';
import { RouterProvider } from 'react-aria-components';
import { CarvedProvider } from '@plurid/carved-ui-react';
import { DocsLayout } from './components/layout';
import { Prose } from './components/prose';
import { Landing } from './pages/landing';
import { useSiteTheme } from './theme';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

// Each page loads when it is first visited; prerendering waits for all of them.
const page = <T,>(load: () => Promise<T>, pick: (module: T) => React.ComponentType) =>
  lazy(() => load().then((module) => ({ default: pick(module) })));
const Material = page(
  () => import('./pages/material'),
  (module) => module.Material,
);
const ThemeLab = page(
  () => import('./pages/themes'),
  (module) => module.ThemeLab,
);
const ComponentIndex = page(
  () => import('./pages/components'),
  (module) => module.ComponentIndex,
);
const ComponentPage = page(
  () => import('./pages/components'),
  (module) => module.ComponentPage,
);
const Recipes = page(
  () => import('./pages/recipes'),
  (module) => module.Recipes,
);
const NotFound = page(
  () => import('./pages/not-found'),
  (module) => module.NotFound,
);
// The guides are the repository's own Markdown, so they read the same on GitHub.
const guide = (load: () => Promise<{ default: React.ComponentType }>) =>
  page(load, (module) => () => (
    <Prose>
      <module.default />
    </Prose>
  ));
const Start = guide(() => import('../../../docs/getting-started.md'));
const Accessibility = guide(() => import('../../../docs/accessibility.md'));
const Migration = guide(() => import('../../../docs/migration.md'));

export const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Marks the page interactive for the browser tests. It sits inside the pages' Suspense boundary,
 * so it runs only once the current page, which may load lazily, has hydrated too.
 */
function Hydrated() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = '';
  }, []);
  return null;
}

export function App() {
  const navigate = useNavigate();
  const theme = useSiteTheme();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <CarvedProvider theme={theme} locale="en-US" className="site">
        <Suspense>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<DocsLayout />}>
              <Route path="/start" element={<Start />} />
              <Route path="/material" element={<Material />} />
              <Route path="/themes" element={<ThemeLab />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/migration" element={<Migration />} />
              <Route path="/components" element={<ComponentIndex />} />
              <Route path="/components/:slug" element={<ComponentPage />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Hydrated />
        </Suspense>
      </CarvedProvider>
    </RouterProvider>
  );
}
