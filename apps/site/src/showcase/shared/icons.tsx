import type { ComponentProps } from 'react';

type IconProps = ComponentProps<'svg'>;

/** Small stroke icons for the showcase apps, hidden from assistive technology. */
function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

const icon = (path: string) => (props: IconProps) => (
  <Icon {...props}>
    <path d={path} />
  </Icon>
);

export const InboxIcon = icon('M3 13h5l1.5 3h5L16 13h5M5 5h14l2 8v6H3v-6Z');
export const StarIcon = icon(
  'm12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z',
);
export const SendIcon = icon('m4 12 16-8-6 16-2.5-6.5Z M11.5 13.5 20 4');
export const DraftIcon = icon('M14 3H6v18h12V7Zm0 0v4h4M9 13h6M9 17h4');
export const ArchiveIcon = icon('M3 5h18v4H3Zm2 4v10h14V9M10 13h4');
export const TrashIcon = icon('M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13');
export const MailIcon = icon('M3 6h18v12H3Zm0 0 9 7 9-7');
export const BackIcon = icon('M19 12H5m6-6-6 6 6 6');
export const PenIcon = icon('M4 20h4L19 9l-4-4L4 16Zm9-13 4 4');
export const ClockIcon = icon('M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0');
export const FolderIcon = icon('M3 6h6l2 2h10v11H3Z');
export const UsersIcon = icon(
  'M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m17 0v-1a4 4 0 0 0-3-3.9M13 5.1a4 4 0 0 1 0 7.8M13.5 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
);
export const GridIcon = icon('M4 4h7v7H4Zm9 0h7v7h-7ZM4 13h7v7H4Zm9 0h7v7h-7Z');
export const ListIcon = icon('M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01');
export const DownloadIcon = icon('M12 4v11m-5-5 5 5 5-5M5 20h14');
export const RocketIcon = icon(
  'M5 15c-1.5 1-2 4-2 6 2 0 5-.5 6-2m-4-4 4 4m-4-4 3-6 9-5c0 4-2 8-5 9l-6 3m5-8.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1',
);
export const GaugeIcon = icon('M12 14l4-4M3.5 17a9 9 0 1 1 17 0');
export const SettingsIcon = icon(
  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6m7.4-1.6.1-1.4-.1-1.4 2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.4-1.4L14.3 3h-4l-.4 2.3a7 7 0 0 0-2.4 1.4l-2.3-.9-2 3.4 2 1.5-.1 1.3.1 1.4-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.4 1.4l.4 2.4h4l.4-2.4a7 7 0 0 0 2.4-1.4l2.3.9 2-3.4Z',
);
export const GlobeIcon = icon(
  'M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18m0 18a9 9 0 1 0 0-18 9 9 0 0 0 0 18',
);
export const PhotoIcon = icon(
  'M4 5h16v14H4Zm0 11 4-4 3 3 4-5 5 6M9 9.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0',
);
export const SearchIcon = icon('m20 20-4.5-4.5M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0');
export const DocumentIcon = icon('M14 3H6v18h12V7Zm0 0v4h4');
