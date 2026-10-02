import { between, emailOf, NOW, people, pick, seeded } from '../shared/random';
import type { Random } from '../shared/random';
import type { Label } from './places';

export interface Person {
  name: string;
  email: string;
}

export interface Message {
  id: number;
  /** Where the message lives. Starred is a mark, not a mailbox. */
  mailbox: 'inbox' | 'sent' | 'drafts' | 'archive';
  from: Person;
  to: Person;
  subject: string;
  /** The opening of the body, shown in the list. */
  snippet: string;
  body: string[];
  /** When it was sent, in milliseconds since 1970 (UTC). */
  sent: number;
  unread: boolean;
  starred: boolean;
  labels: Label[];
}

/** You: the account the app is signed in to. */
export const me: Person = { name: 'Amara Okafor', email: 'amara@post.example' };

const domains = ['quarry.example', 'atelier.example', 'northwind.example', 'basalt.example'];

/** Conversations the inbox is made of, each with a few ways of being written. */
const topics: { label?: Label; subjects: string[]; paragraphs: string[] }[] = [
  {
    label: 'work',
    subjects: ['Quarterly review: notes and next steps', 'Notes from the quarterly review'],
    paragraphs: [
      'Thanks for the time today. I wrote down what we agreed so nothing slips between now and the next review.',
      'Search moves to the top of the list, and billing waits until the new plans are priced. Each owner sends a short update by Friday.',
      'If I missed something, reply here and I will fold it in before sharing with the wider team.',
    ],
  },
  {
    label: 'work',
    subjects: ['Design critique on Thursday', 'Moving Thursday’s critique'],
    paragraphs: [
      'We are looking at the new onboarding flow on Thursday at two. Bring the prototype as it is; rough is fine.',
      'The goal is to decide which of the three directions we take forward, not to polish any of them.',
    ],
  },
  {
    label: 'work',
    subjects: ['Launch checklist for 2.0', 'Release 2.0: what is left'],
    paragraphs: [
      'Twelve of the fifteen items are done. What is left: the migration guide, the status page and the announcement.',
      'I can take the status page if someone else picks up the announcement.',
    ],
  },
  {
    label: 'travel',
    subjects: ['Your trip to Lisbon', 'Lisbon: your booking is confirmed'],
    paragraphs: [
      'Your stay in Lisbon is confirmed for three nights, from the 24th. Check-in opens at three in the afternoon.',
      'The tram stop is a short walk from the door. We have left a few recommendations for dinner in your room.',
    ],
  },
  {
    label: 'travel',
    subjects: ['Boarding pass for Kyoto', 'Your flight to Osaka is ready for check-in'],
    paragraphs: [
      'Check-in is open. Your seat is 23A, by the window, and your bag allowance is one piece of 23 kg.',
      'From the airport, the express train reaches Kyoto in about 75 minutes.',
    ],
  },
  {
    label: 'receipts',
    subjects: ['Your receipt from Quarry', 'Payment received, thank you'],
    paragraphs: [
      'We received your payment for the Team plan. The receipt is below, and in your account’s billing page.',
      'If anything looks wrong, reply to this message and someone will look into it within a day.',
    ],
  },
  {
    label: 'receipts',
    subjects: ['Order shipped: two notebooks', 'Your order is on its way'],
    paragraphs: [
      'Your order has left the warehouse and should arrive in two to three working days.',
      'You can follow the parcel with the tracking number in your account.',
    ],
  },
  {
    subjects: ['Lunch on Friday?', 'Friday lunch, same place?'],
    paragraphs: [
      'There is a new place by the river that does a good set lunch. Friday at half twelve?',
      'If not, the usual place is fine too.',
    ],
  },
  {
    subjects: ['Photos from the weekend', 'The pictures, finally'],
    paragraphs: [
      'Here are the photos from the hike. The light on the ridge came out better than I expected.',
      'The full set is in the shared folder; take any you like.',
    ],
  },
  {
    subjects: ['Book club: next title', 'What should we read next?'],
    paragraphs: [
      'We finished the last one early, so it is time to choose. Three suggestions so far; vote by Sunday.',
    ],
  },
  {
    subjects: ['Weekly digest', 'This week in your workspace'],
    paragraphs: [
      'Four projects changed this week. Two deploys failed and were rolled back; everything else went out cleanly.',
      'Storage is at 62% of your plan.',
    ],
  },
];

const others = people.filter((person) => person !== me.name);

function write(
  random: Random,
  id: number,
  mailbox: Message['mailbox'],
  sent: number,
  fromMe: boolean,
): Message {
  const topic = pick(random, topics);
  const name = pick(random, others);
  const other: Person = { name, email: emailOf(name, pick(random, domains)) };
  const subject = pick(random, topic.subjects);
  const body = topic.paragraphs;
  return {
    id,
    mailbox,
    from: fromMe ? me : other,
    to: fromMe ? other : me,
    subject: random() < 0.2 ? `Re: ${subject}` : subject,
    snippet: body[0]!,
    body,
    sent,
    unread: false,
    starred: random() < 0.04,
    labels: topic.label ? [topic.label] : [],
  };
}

/** A mailbox of `count` messages, newest first, sent a few minutes to hours apart. */
function box(
  random: Random,
  mailbox: Message['mailbox'],
  count: number,
  first: number,
  fromMe = false,
) {
  let at = NOW - between(random, 3, 20) * 60_000;
  return Array.from({ length: count }, (_, index) => {
    const message = write(random, first + index, mailbox, at, fromMe);
    at -= between(random, 4, 160) * 60_000;
    return message;
  });
}

/**
 * Everything in the account, the same every time: the newest few in the inbox are still
 * unread.
 */
export function createMail(): Message[] {
  const random = seeded(20260310);
  const inbox = box(random, 'inbox', 5000, 1).map((message, index) => ({
    ...message,
    unread: index < 7 || (index < 400 && random() < 0.03),
  }));
  return [
    ...inbox,
    ...box(random, 'archive', 1500, 10_001),
    ...box(random, 'sent', 400, 20_001, true),
    ...box(random, 'drafts', 3, 30_001, true),
  ];
}
