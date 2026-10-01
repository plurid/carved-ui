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
