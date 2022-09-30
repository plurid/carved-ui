import type { ComponentProps } from 'react';
export function Chevron(props: ComponentProps<'svg'>) {
  return (
    <svg {...props} viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Check(props: ComponentProps<'svg'>) {
  return (
    <svg {...props} viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Close(props: ComponentProps<'svg'>) {
  return (
    <svg {...props} viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="m6 6 12 12M6 18 18 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
