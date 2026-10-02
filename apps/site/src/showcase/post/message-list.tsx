import {
  Autocomplete,
  Avatar,
  GridList,
  GridListItem,
  Heading,
  SearchField,
  Virtualizer,
} from '@plurid/carved-ui-react';
import type { Key } from '@plurid/carved-ui-react';
import { useTimes } from '../shared/time';
import { labels } from './places';
import type { Message } from './data';

interface MessageListProps {
  /** The place's name, such as "Inbox": the page's heading. */
  title: string;
  /** Says how many messages there are, under the heading. */
  summary: string;
  messages: Message[];
  openId: number | null;
  onOpen: (id: number) => void;
  /** Whether the list shows who a message went to, as in Sent and Drafts. */
  outgoing: boolean;
}

/**
 * The messages of one place: a search field filtering a virtualized list of thousands, newest
 * first. Choosing a message opens it; the arrow keys move through them.
 */
export function MessageList({
  title,
  summary,
  messages,
  openId,
  onOpen,
  outgoing,
}: MessageListProps) {
  const times = useTimes();
  return (
    <section className="post-list" aria-labelledby="post-place">
      <header className="post-list-head">
        <Heading level={1} id="post-place" className="post-place">
          {title}
        </Heading>
        <p className="post-count">{summary}</p>
      </header>
      <Autocomplete>
        <SearchField aria-label={`Search ${title}`} placeholder={`Search ${title.toLowerCase()}`} />
        <Virtualizer layoutOptions={{ estimatedRowSize: 84 }}>
          <GridList
            aria-label={title}
            items={messages}
            selectionMode="single"
            selectionBehavior="replace"
            selectedKeys={openId === null ? [] : [openId]}
            onSelectionChange={(keys) => {
              const [key] = keys === 'all' ? [] : [...keys];
              if (key !== undefined) onOpen(key as number);
            }}
            renderEmptyState={() => 'No messages here.'}
            className="post-messages"
          >
            {(message) => {
              const person = outgoing ? message.to : message.from;
              return (
                <GridListItem
                  id={message.id as Key}
                  textValue={`${message.unread ? 'Unread, ' : ''}${person.name}, ${message.subject}`}
                  className={message.unread ? 'post-row post-row-unread' : 'post-row'}
                >
                  <Avatar name={person.name} size="sm" />
                  <span className="post-row-text">
                    <span className="post-row-top">
                      <span className="post-row-from">
                        {outgoing ? `To ${person.name}` : person.name}
                      </span>
                      <time
                        className="post-row-time"
                        dateTime={new Date(message.sent).toISOString()}
                      >
                        {times.short(message.sent)}
                      </time>
                    </span>
                    <span className="post-row-subject">{message.subject}</span>
                    <span className="post-row-snippet">{message.snippet}</span>
                  </span>
                  {message.labels.length > 0 && (
                    <span className="post-row-labels" aria-hidden="true">
                      {message.labels.map((slug) => (
                        <span
                          key={slug}
                          className="post-dot"
                          data-tone={labels.find((label) => label.slug === slug)!.tone}
                        />
                      ))}
                    </span>
                  )}
                </GridListItem>
              );
            }}
          </GridList>
        </Virtualizer>
      </Autocomplete>
    </section>
  );
}
