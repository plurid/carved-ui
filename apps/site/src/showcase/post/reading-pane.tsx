import { useState } from 'react';
import {
  AlertDialog,
  Avatar,
  Button,
  DialogTrigger,
  Form,
  Heading,
  IconButton,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Modal,
  SubmenuTrigger,
  Surface,
  Tag,
  TagGroup,
  TextField,
  ToggleButton,
  Toolbar,
  Tooltip,
  TooltipTrigger,
} from '@plurid/carved-ui-react';
import type { ReactNode } from 'react';
import { useTimes } from '../shared/time';
import {
  ArchiveIcon,
  BackIcon,
  ClockIcon,
  FolderIcon,
  MailIcon,
  StarIcon,
  TrashIcon,
} from '../shared/icons';
import { labels } from './places';
import type { Label } from './places';
import type { Message } from './data';

/** What can be done to the open message. */
export interface MessageActions {
  archive: () => void;
  remove: () => void;
  markUnread: () => void;
  toggleStar: () => void;
  moveTo: (mailbox: 'inbox' | 'archive') => void;
  setLabels: (labels: Label[]) => void;
  snooze: (until: string) => void;
  reply: (text: string) => void;
}

interface ReadingPaneProps {
  message: Message | null;
  /** The place the message is in, for the back button on narrow screens. */
  place: string;
  onBack: () => void;
  actions: MessageActions;
}

function Action({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <TooltipTrigger>
      <IconButton aria-label={label} onPress={onPress}>
        {children}
      </IconButton>
      <Tooltip>{label}</Tooltip>
    </TooltipTrigger>
  );
}

/** The open message, its actions and a reply. */
export function ReadingPane({ message, place, onBack, actions }: ReadingPaneProps) {
  const times = useTimes();
  const [reply, setReply] = useState('');
  // A new message starts with an empty reply.
  const [replyingTo, setReplyingTo] = useState(message?.id);
  if (message?.id !== replyingTo) {
    setReplyingTo(message?.id);
    setReply('');
  }

  if (!message)
    return (
      <Surface className="post-reading post-reading-empty">
        <MailIcon width={32} height={32} />
        <p>Choose a message to read it here.</p>
      </Surface>
    );

  return (
    <Surface as="article" aria-labelledby="post-subject" className="post-reading">
      <Toolbar aria-label="Message" className="post-actions">
        <IconButton aria-label={`Back to ${place}`} className="post-back" onPress={onBack}>
          <BackIcon />
        </IconButton>
        <Action label="Archive" onPress={actions.archive}>
          <ArchiveIcon />
        </Action>
        <DialogTrigger>
          <TooltipTrigger>
            <IconButton aria-label="Delete">
              <TrashIcon />
            </IconButton>
            <Tooltip>Delete</Tooltip>
          </TooltipTrigger>
          <Modal size="sm">
            <AlertDialog
              title="Delete this message?"
              actionLabel="Delete"
              onAction={actions.remove}
            >
              “{message.subject}” is deleted for good, with no way to bring it back.
            </AlertDialog>
          </Modal>
        </DialogTrigger>
        <Action label="Mark as unread" onPress={actions.markUnread}>
          <MailIcon />
        </Action>
        <TooltipTrigger>
          <ToggleButton
            aria-label="Star"
            isSelected={message.starred}
            onChange={actions.toggleStar}
            className="post-star"
          >
            <StarIcon />
          </ToggleButton>
          <Tooltip>{message.starred ? 'Starred' : 'Star'}</Tooltip>
        </TooltipTrigger>
        <MenuTrigger>
          <TooltipTrigger>
            <IconButton aria-label="Snooze">
              <ClockIcon />
            </IconButton>
            <Tooltip>Snooze</Tooltip>
          </TooltipTrigger>
          <Menu aria-label="Snooze until" onAction={(key) => actions.snooze(String(key))}>
            <MenuItem id="this evening">This evening</MenuItem>
            <MenuItem id="tomorrow morning">Tomorrow morning</MenuItem>
            <MenuItem id="next week">Next week</MenuItem>
          </Menu>
        </MenuTrigger>
        <MenuTrigger>
          <TooltipTrigger>
            <IconButton aria-label="Move to">
              <FolderIcon />
            </IconButton>
            <Tooltip>Move to</Tooltip>
          </TooltipTrigger>
          <Menu aria-label="Move to">
            <MenuSection title="Mailbox">
              <MenuItem
                id="inbox"
                isDisabled={message.mailbox === 'inbox'}
                onAction={() => actions.moveTo('inbox')}
              >
                Inbox
              </MenuItem>
              <MenuItem
                id="archive"
                isDisabled={message.mailbox === 'archive'}
                onAction={() => actions.moveTo('archive')}
              >
                Archive
              </MenuItem>
            </MenuSection>
            <SubmenuTrigger>
              <MenuItem id="label">Label</MenuItem>
              <Menu
                aria-label="Labels"
                selectionMode="multiple"
                selectedKeys={message.labels}
                onSelectionChange={(keys) =>
                  actions.setLabels(
                    keys === 'all' ? labels.map((label) => label.slug) : ([...keys] as Label[]),
                  )
                }
              >
                {labels.map((label) => (
                  <MenuItem key={label.slug} id={label.slug}>
                    {label.name}
                  </MenuItem>
                ))}
              </Menu>
            </SubmenuTrigger>
          </Menu>
        </MenuTrigger>
      </Toolbar>

      <div className="post-letter" role="region" aria-label="Message" tabIndex={0}>
        <Heading level={2} id="post-subject" className="post-subject">
          {message.subject}
        </Heading>
        <div className="post-sender">
          <Avatar name={message.from.name} />
          <div className="post-sender-text">
            <strong>{message.from.name}</strong>
            <span className="post-muted">
              {message.from.email} · to {message.to.name}
            </span>
          </div>
          <time className="post-muted" dateTime={new Date(message.sent).toISOString()}>
            {times.full(message.sent)}
          </time>
        </div>
        {message.labels.length > 0 && (
          <TagGroup
            aria-label="Labels"
            onRemove={(keys) =>
              actions.setLabels(message.labels.filter((label) => !keys.has(label)))
            }
          >
            {message.labels.map((slug) => (
              <Tag key={slug} id={slug}>
                {labels.find((label) => label.slug === slug)!.name}
              </Tag>
            ))}
          </TagGroup>
        )}
        <div className="post-body">
          {message.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>{message.from.name.split(' ')[0]}</p>
        </div>
      </div>

      <Form
        className="post-reply"
        onSubmit={(event) => {
          event.preventDefault();
          if (!reply.trim()) return;
          actions.reply(reply);
          setReply('');
        }}
      >
        <TextField
          label={`Reply to ${message.from.name}`}
          multiline
          rows={2}
          value={reply}
          onChange={setReply}
        />
        <Button type="submit" isDisabled={!reply.trim()}>
          Send
        </Button>
      </Form>
    </Surface>
  );
}
