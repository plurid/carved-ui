import type { ComponentProps } from 'react';

type IconProps = ComponentProps<'svg'>;

/** Decorative 16px stroke icons, hidden from assistive technology. */
function Icon(props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Icon>
);
export const Minus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 12h12" />
  </Icon>
);
export const ChevronDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
/** Points toward the end of the line; flips in right-to-left layouts. */
export const ChevronEnd = (props: IconProps) => (
  <Icon className="carved-icon-flip" {...props}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);
export const Close = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);
export const Search = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </Icon>
);
export const Info = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5v.01" />
  </Icon>
);
export const Success = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.5 2.5L16 9.5" />
  </Icon>
);
export const Warning = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3.5 2.5 20h19z" />
    <path d="M12 10v4M12 17v.01" />
  </Icon>
);
export const Danger = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6M15 9l-6 6" />
  </Icon>
);
export const Plus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
/** Points toward the start of the line; flips in right-to-left layouts. */
export const ChevronStart = (props: IconProps) => (
  <Icon className="carved-icon-flip" {...props}>
    <path d="m15 6-6 6 6 6" />
  </Icon>
);
export const ChevronUp = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 15 6-6 6 6" />
  </Icon>
);
export const ChevronsUpDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="m8 9 4-4 4 4M8 15l4 4 4-4" />
  </Icon>
);
export const CalendarIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 10h16M9 3v4M15 3v4" />
  </Icon>
);
export const ClockIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);
export const Upload = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
  </Icon>
);
