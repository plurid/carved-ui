/// <reference types="vite/client" />

declare module '*?example' {
  import type { ComponentType } from 'react';
  const Example: ComponentType;
  export default Example;
  /** The example's source, as highlighted HTML. */
  export const code: string;
  /** The example's source, as plain text for copying. */
  export const source: string;
}

declare module 'virtual:carved-api' {
  interface Prop {
    name: string;
    type: string;
    required: boolean;
    defaultValue?: string;
    description: string;
  }
  /** The props each component declares itself, read from the package's types. */
  const api: Record<string, { description: string; props: Prop[] }>;
  export default api;
}

declare module '*.md' {
  import type { ComponentType } from 'react';
  const Content: ComponentType;
  export default Content;
}

declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Content: ComponentType;
  export default Content;
}
