import { catalog } from './catalog';

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
};

/** The document title of a page. */
export function titleFor(path: string): string {
  return titles[path] ? `${titles[path]} · Carved UI` : 'Carved UI: surfaces cut into one material';
}

/** Every page, for prerendering. */
export const paths = [
  '/',
  ...guides.map((guide) => guide.path),
  '/components',
  ...catalog.map((entry) => `/components/${entry.slug}`),
  '/recipes',
];
