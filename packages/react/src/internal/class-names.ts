import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import { cx } from './cx.js';

export { cx };

/** Prefix a className, which may be a React Aria render function, with Carved's classes. */
export function withClass<T>(
  base: string,
  className: string | ((values: T) => string) | undefined,
) {
  return composeRenderProps(className, (custom) => cx(base, custom));
}
