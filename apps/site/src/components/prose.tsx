import { useRef } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Heading, Link, Separator, Table } from '@plurid/carved-ui-react';
import { CopyButton } from './copy-button';

function Pre(props: ComponentProps<'pre'>) {
  const pre = useRef<HTMLPreElement>(null);
  return (
    <div className="code-block carved-carve">
      <CopyButton text={() => pre.current?.textContent ?? ''} />
      <div className="code-scroll">
        <pre {...props} ref={pre} />
      </div>
    </div>
  );
}

const components = {
  h1: (props: ComponentProps<'h1'>) => <Heading level={1} {...props} />,
  h2: (props: ComponentProps<'h2'>) => <Heading level={2} {...props} />,
  h3: (props: ComponentProps<'h3'>) => <Heading level={3} {...props} />,
  a: ({ href = '', children }: ComponentProps<'a'>) => <Link href={href}>{children}</Link>,
  hr: () => <Separator />,
  table: (props: ComponentProps<'table'>) => <Table {...props} />,
  pre: Pre,
};

/** Long-form documentation, written in MDX and set in Carved components. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <article className="prose">
      <MDXProvider components={components}>{children}</MDXProvider>
    </article>
  );
}
