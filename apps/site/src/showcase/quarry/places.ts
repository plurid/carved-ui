/** Quarry's pages: each is a place in the sidebar, at its own path. */
export const consolePages = [
  { slug: 'overview', name: 'Overview' },
  { slug: 'deploys', name: 'Deploys' },
  { slug: 'settings', name: 'Settings' },
] as const;

export type ConsolePage = (typeof consolePages)[number]['slug'];
