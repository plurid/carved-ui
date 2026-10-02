// The site's pages load lazily. The routes and prefetching share these loaders, so a page
// fetched ahead of a visit is the same module the visit uses.
export const pages = {
  material: () => import('./pages/material'),
  themes: () => import('./pages/themes'),
  components: () => import('./pages/components'),
  recipes: () => import('./pages/recipes'),
  showcase: () => import('./showcase/gallery'),
  post: () => import('./showcase/post/route'),
  quarry: () => import('./showcase/quarry/route'),
  strata: () => import('./showcase/strata/route'),
  notFound: () => import('./pages/not-found'),
  start: () => import('../../../docs/getting-started.md'),
  accessibility: () => import('../../../docs/accessibility.md'),
  migration: () => import('../../../docs/migration.md'),
};

const byPath: Record<string, () => Promise<unknown>> = {
  '/start': pages.start,
  '/material': pages.material,
  '/themes': pages.themes,
  '/accessibility': pages.accessibility,
  '/migration': pages.migration,
  '/components': pages.components,
  '/recipes': pages.recipes,
  // The apps themselves load only when visited.
  '/showcase': pages.showcase,
};

/** Start loading a page and, for a component page, its examples. Safe to call repeatedly. */
export function preloadPath(path: string): void {
  const page = path.length > 1 ? path.replace(/\/+$/, '') : path;
  const slug = page.match(/^\/components\/([\w-]+)$/)?.[1];
  const load = slug
    ? () => pages.components().then((module) => module.preloadExamples(slug))
    : byPath[page];
  // A failed prefetch is forgotten, so the visit itself tries again.
  load?.().catch(() => undefined);
}

/** Load every page in the background, once the browser is idle, unless data is being saved. */
export function preloadAll(paths: readonly string[]): void {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;
  const idle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 200));
  idle(() => paths.forEach(preloadPath));
}
