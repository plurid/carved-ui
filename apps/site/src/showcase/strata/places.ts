/** Strata's places: each is a place in the sidebar, at its own path. */
export const drivePlaces = [
  { slug: 'files', name: 'My files' },
  { slug: 'shared', name: 'Shared with me' },
  { slug: 'recent', name: 'Recent' },
  { slug: 'trash', name: 'Trash' },
] as const;

export type DrivePlace = (typeof drivePlaces)[number]['slug'];
