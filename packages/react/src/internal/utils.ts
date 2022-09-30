export function cx(...values: (string | false | undefined)[]) {
  return values.filter(Boolean).join(' ');
}
export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
