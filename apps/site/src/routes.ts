import { catalog } from './catalog';
import { showcasePages } from './showcase/meta';

export const guides = [
  { path: '/start', title: 'Getting started' },
  { path: '/material', title: 'The material' },
  { path: '/themes', title: 'Themes' },
  { path: '/accessibility', title: 'Accessibility' },
  { path: '/migration', title: 'Migrating from 0.x' },
];

const titles: Record<string, string> = {
  ...Object.fromEntries(guides.map((guide) => [guide.path, guide.title])),
  ...Object.fromEntries(catalog.map((entry) => [`/components/${entry.slug}`, entry.title])),
  '/components': 'Components',
  '/recipes': 'Recipes',
  '/showcase': 'Showcase',
  ...Object.fromEntries(showcasePages.map((page) => [page.path, page.title])),
};

/**
 * A path without its trailing slash. Static hosts such as GitHub Pages redirect `/start` to
 * `/start/`; both are the same page.
 */
export function canonical(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

/** The document title of a page. */
export function titleFor(path: string): string {
  const page = titles[canonical(path)];
  return page ? `${page} · Carved UI` : 'Carved UI: surfaces cut into one material';
}

/** Every page, for prerendering. */
export const paths = [
  '/',
  ...guides.map((guide) => guide.path),
  '/components',
  ...catalog.map((entry) => `/components/${entry.slug}`),
  '/recipes',
  '/showcase',
  ...showcasePages.map((page) => page.path),
];
