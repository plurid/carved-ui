import { lazy, useTransition } from 'react';
import { Route, Routes, useHref, useNavigate } from 'react-router';
import type { NavigateOptions } from 'react-router';
import { CarvedProvider } from '@plurid/carved-ui-react';
import { DocsLayout } from './components/layout';
import { Prose } from './components/prose';
import { Landing } from './pages/landing';
import { Hydrated, PageError } from './components/page-state';
import { pages } from './prefetch';
import { ShowcaseLayout } from './showcase/layout';
import { useSiteTheme } from './theme';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

// Each page loads when it is first visited; prerendering waits for all of them.
const page = <T,>(load: () => Promise<T>, pick: (module: T) => React.ComponentType) =>
  lazy(() => load().then((module) => ({ default: pick(module) })));
const Material = page(pages.material, (module) => module.Material);
const ThemeLab = page(pages.themes, (module) => module.ThemeLab);
const ComponentIndex = page(pages.components, (module) => module.ComponentIndex);
const ComponentPage = page(pages.components, (module) => module.ComponentPage);
const Recipes = page(pages.recipes, (module) => module.Recipes);
const NotFound = page(pages.notFound, (module) => module.NotFound);
const Showcase = page(pages.showcase, (module) => module.Showcase);
const PostRoute = page(pages.post, (module) => module.PostRoute);
const QuarryRoute = page(pages.quarry, (module) => module.QuarryRoute);
const StrataRoute = page(pages.strata, (module) => module.StrataRoute);
// The guides are the repository's own Markdown, so they read the same on GitHub.
const guide = (load: () => Promise<{ default: React.ComponentType }>) =>
  page(load, (module) => () => (
    <Prose>
      <module.default />
    </Prose>
  ));
const Start = guide(pages.start);
const Accessibility = guide(pages.accessibility);
const Migration = guide(pages.migration);

export const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export function App() {
  const navigate = useNavigate();
  const theme = useSiteTheme();
  // Navigation is a transition: the current page stays until the next has fully loaded,
  // and a groove at the top of the window shows that it is on its way.
  const [isNavigating, startNavigation] = useTransition();
  return (
    <CarvedProvider
      theme={theme}
      locale="en-US"
      navigate={(to, options) => startNavigation(() => navigate(to, options))}
      useHref={useHref}
      className="site"
    >
      <div className="site-progress" data-active={isNavigating || undefined} aria-hidden="true" />
      <PageError>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Landing />
                <Hydrated />
              </>
            }
          />
          <Route element={<DocsLayout />}>
            <Route path="/start" element={<Start />} />
            <Route path="/material" element={<Material />} />
            <Route path="/themes" element={<ThemeLab />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/migration" element={<Migration />} />
            <Route path="/components" element={<ComponentIndex />} />
            <Route path="/components/:slug" element={<ComponentPage />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* The showcase apps fill the window with their own frames. */}
          <Route element={<ShowcaseLayout />}>
            <Route path="/showcase/mail/*" element={<PostRoute />} />
            <Route path="/showcase/console/*" element={<QuarryRoute />} />
            <Route path="/showcase/files/*" element={<StrataRoute />} />
          </Route>
        </Routes>
      </PageError>
    </CarvedProvider>
  );
}
