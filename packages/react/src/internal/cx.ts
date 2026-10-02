/** Join class names, skipping empty ones. Free of dependencies, so server components can use it. */
export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}
