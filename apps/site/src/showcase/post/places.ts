/** Post's mailboxes and labels: each is a place in the sidebar, at its own path. */
export const mailboxes = [
  { slug: 'inbox', name: 'Inbox' },
  { slug: 'starred', name: 'Starred' },
  { slug: 'sent', name: 'Sent' },
  { slug: 'drafts', name: 'Drafts' },
  { slug: 'archive', name: 'Archive' },
] as const;

export const labels = [
  { slug: 'work', name: 'Work', tone: 'accent' },
  { slug: 'travel', name: 'Travel', tone: 'success' },
  { slug: 'receipts', name: 'Receipts', tone: 'warning' },
] as const;

export type Mailbox = (typeof mailboxes)[number]['slug'];
export type Label = (typeof labels)[number]['slug'];
