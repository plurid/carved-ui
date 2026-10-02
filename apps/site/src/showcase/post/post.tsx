import { useMemo, useState } from 'react';
import type { ThemePreset } from '@plurid/carved-ui-core';
import {
  AppShell,
  Avatar,
  Button,
  Meter,
  Sidebar,
  SidebarItem,
  SidebarSection,
  SplitPane,
  SplitView,
  ToastQueue,
  ToastRegion,
  useLocale,
} from '@plurid/carved-ui-react';
import { ThemeMenu } from '../shared/theme-menu';
import {
  ArchiveIcon,
  DraftIcon,
  GridIcon,
  InboxIcon,
  PenIcon,
  SendIcon,
  StarIcon,
} from '../shared/icons';
import { NOW } from '../shared/random';
import { Compose } from './compose';
import type { Draft } from './compose';
import { createMail, me } from './data';
import type { Message, Person } from './data';
import { MessageList } from './message-list';
import { ReadingPane } from './reading-pane';
import type { MessageActions } from './reading-pane';
import { labels, mailboxes } from './places';
import type { Label, Mailbox } from './places';

export interface PostProps {
  /** The mailbox shown, unless a label is. */
  mailbox: Mailbox;
  /** The label whose messages are shown, if one is. */
  label: Label | null;
  /** The path the app is served at: places are its subpaths. */
  base: string;
  /** Where "All apps" goes. */
  exitHref: string;
  theme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
}

const toasts = new ToastQueue({ maxVisibleToasts: 3 });

const icons: Record<Mailbox, typeof InboxIcon> = {
  inbox: InboxIcon,
  starred: StarIcon,
  sent: SendIcon,
  drafts: DraftIcon,
  archive: ArchiveIcon,
};

/** Which messages a place holds. */
function holds(place: { mailbox: Mailbox; label: Label | null }, message: Message) {
  if (place.label) return message.labels.includes(place.label) && message.mailbox !== 'drafts';
  if (place.mailbox === 'starred') return message.starred;
  return message.mailbox === place.mailbox;
}

/**
 * Post, a mail client: mailboxes and labels in the sidebar, five thousand messages filtered as
 * you type, the open message beside them, and a drawer to write a new one.
 */
export function Post({ mailbox, label, base, exitHref, theme, onThemeChange }: PostProps) {
  const { locale } = useLocale();
  const [messages, setMessages] = useState(createMail);
  const [openId, setOpenId] = useState<number | null>(null);
  const [view, setView] = useState<'list' | 'message'>('list');
  const [composing, setComposing] = useState(false);

  // Each place opens on its list, with nothing chosen.
  const placeKey = label ? `label:${label}` : mailbox;
  const [shown, setShown] = useState(placeKey);
  if (shown !== placeKey) {
    setShown(placeKey);
    setOpenId(null);
    setView('list');
  }

  const place = useMemo(() => ({ mailbox, label }), [mailbox, label]);
  const visible = useMemo(
    () => messages.filter((message) => holds(place, message)),
    [messages, place],
  );
  const open = messages.find((message) => message.id === openId) ?? null;
  const title = label
    ? labels.find((item) => item.slug === label)!.name
    : mailboxes.find((item) => item.slug === mailbox)!.name;

  const count = new Intl.NumberFormat(locale);
  const unread = (box: Mailbox) =>
    messages.filter((message) => message.mailbox === box && message.unread).length;
  const unreadHere = visible.filter((message) => message.unread).length;
  const summary = `${count.format(visible.length)} ${visible.length === 1 ? 'message' : 'messages'}${
    unreadHere ? `, ${count.format(unreadHere)} unread` : ''
  }`;

  const contacts = useMemo(() => {
    const seen = new Map<string, Person>();
    for (const message of messages.slice(0, 400)) seen.set(message.from.email, message.from);
    seen.delete(me.email);
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [messages, locale]);

  const change = (id: number, update: (message: Message) => Message) =>
    setMessages((all) => all.map((message) => (message.id === id ? update(message) : message)));

  const openMessage = (id: number) => {
    setOpenId(id);
    setView('message');
    change(id, (message) => (message.unread ? { ...message, unread: false } : message));
  };

  /** After a message leaves this place, the next one opens, as in any mail client. */
  const leave = (id: number) => {
    const index = visible.findIndex((message) => message.id === id);
    const next = visible[index + 1] ?? visible[index - 1];
    setOpenId(next && next.id !== id ? next.id : null);
    if (!next) setView('list');
  };

  const actions: MessageActions = {
    archive() {
      if (!open) return;
      const previous = open.mailbox;
      leave(open.id);
      change(open.id, (message) => ({ ...message, mailbox: 'archive' }));
      toasts.add(
        {
          title: 'Archived',
          description: open.subject,
          action: {
            label: 'Undo',
            onAction: () => change(open.id, (message) => ({ ...message, mailbox: previous })),
          },
        },
        { timeout: 6000 },
      );
    },
    remove() {
      if (!open) return;
      leave(open.id);
      setMessages((all) => all.filter((message) => message.id !== open.id));
      toasts.add({ title: 'Deleted', description: open.subject }, { timeout: 5000 });
    },
    markUnread() {
      if (!open) return;
      change(open.id, (message) => ({ ...message, unread: true }));
      setOpenId(null);
      setView('list');
    },
    toggleStar() {
      if (open) change(open.id, (message) => ({ ...message, starred: !message.starred }));
    },
    moveTo(target) {
      if (!open || open.mailbox === target) return;
      if (!holds({ mailbox: target, label }, open)) leave(open.id);
      change(open.id, (message) => ({ ...message, mailbox: target }));
      toasts.add(
        { title: `Moved to ${target === 'inbox' ? 'Inbox' : 'Archive'}` },
        { timeout: 4000 },
      );
    },
    setLabels(next) {
      if (open) change(open.id, (message) => ({ ...message, labels: next }));
    },
    snooze(until) {
      if (!open) return;
      leave(open.id);
      change(open.id, (message) => ({ ...message, mailbox: 'archive' }));
      toasts.add({ title: `Snoozed until ${until}`, description: open.subject }, { timeout: 5000 });
    },
    reply(text) {
      if (!open) return;
      const sent: Message = {
        ...open,
        id: Math.max(...messages.map((message) => message.id)) + 1,
        mailbox: 'sent',
        from: me,
        to: open.from.email === me.email ? open.to : open.from,
        subject: open.subject.startsWith('Re: ') ? open.subject : `Re: ${open.subject}`,
        snippet: text,
        body: text.split(/\n+/),
        sent: NOW,
        unread: false,
        starred: false,
      };
      setMessages((all) => [sent, ...all]);
      toasts.add(
        {
          title: 'Reply sent',
          tone: 'success',
          action: {
            label: 'Undo',
            onAction: () => setMessages((all) => all.filter((message) => message.id !== sent.id)),
          },
        },
        { timeout: 6000 },
      );
    },
  };

  const send = (draft: Draft) => {
    const id = Math.max(...messages.map((message) => message.id)) + 1;
    const recipient = contacts.find(
      (person) => person.email === draft.to || person.name === draft.to,
    );
    setMessages((all) => [
      {
        id,
        mailbox: draft.later ? 'drafts' : 'sent',
        from: me,
        to: recipient ?? { name: draft.to, email: draft.to },
        subject: draft.subject,
        snippet: draft.body,
        body: draft.body.split(/\n+/),
        sent: NOW,
        unread: false,
        starred: false,
        labels: [],
      },
      ...all,
    ]);
    toasts.add(
      draft.later
        ? { title: 'Scheduled', description: `It goes out on ${draft.later}.` }
        : { title: 'Message sent', tone: 'success' },
      { timeout: 5000 },
    );
  };

  const placeHref = (slug: string) => (slug === 'inbox' ? base : `${base}/${slug}`);

  return (
    <>
      <AppShell
        className="post"
        header={
          <>
            <span className="post-brand carved-engrave">Post</span>
            <Button size="sm" onPress={() => setComposing(true)}>
              <PenIcon />
              <span className="post-compose-label">Compose</span>
            </Button>
            <ThemeMenu theme={theme} onThemeChange={onThemeChange} />
            <Avatar name={me.name} size="sm" />
          </>
        }
        sidebar={
          <Sidebar aria-label="Mailboxes">
            <SidebarSection>
              {mailboxes.map((box) => {
                const Icon = icons[box.slug];
                const waiting =
                  box.slug === 'inbox'
                    ? unread('inbox')
                    : box.slug === 'drafts'
                      ? messages.filter((message) => message.mailbox === 'drafts').length
                      : 0;
                return (
                  <SidebarItem
                    key={box.slug}
                    href={placeHref(box.slug)}
                    icon={<Icon />}
                    count={waiting ? count.format(waiting) : undefined}
                    isCurrent={!label && mailbox === box.slug}
                  >
                    {box.name}
                  </SidebarItem>
                );
              })}
            </SidebarSection>
            <SidebarSection title="Labels">
              {labels.map((item) => (
                <SidebarItem
                  key={item.slug}
                  href={`${base}/labels/${item.slug}`}
                  icon={<span className="post-dot" data-tone={item.tone} />}
                  isCurrent={label === item.slug}
                >
                  {item.name}
                </SidebarItem>
              ))}
            </SidebarSection>
            <Meter label="Storage" value={62} valueLabel="9.3 of 15 GB" className="post-storage" />
            <SidebarSection className="post-exit">
              <SidebarItem href={exitHref} icon={<GridIcon />}>
                All apps
              </SidebarItem>
            </SidebarSection>
          </Sidebar>
        }
      >
        <div className="post-main" data-view={view}>
          <SplitView
            defaultSize={40}
            minSize={28}
            maxSize={60}
            handleLabel="Resize the message list"
            className="post-split"
          >
            <SplitPane>
              <MessageList
                key={placeKey}
                title={title}
                summary={summary}
                messages={visible}
                openId={openId}
                onOpen={openMessage}
                outgoing={!label && (mailbox === 'sent' || mailbox === 'drafts')}
              />
            </SplitPane>
            <SplitPane>
              <ReadingPane
                message={open}
                place={title}
                onBack={() => setView('list')}
                actions={actions}
              />
            </SplitPane>
          </SplitView>
        </div>
      </AppShell>
      <Compose isOpen={composing} onOpenChange={setComposing} contacts={contacts} onSend={send} />
      <ToastRegion queue={toasts} />
    </>
  );
}
