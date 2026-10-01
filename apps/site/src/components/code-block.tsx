import type { ReactNode } from 'react';
import { CopyButton } from './copy-button';

/**
 * A code well that scrolls sideways when its lines are long. It is focusable, so keyboard
 * users can scroll it too.
 */
export function CodeScroll(props: { children?: ReactNode; html?: string }) {
  return props.html !== undefined ? (
    <div className="code-scroll" tabIndex={0} dangerouslySetInnerHTML={{ __html: props.html }} />
  ) : (
    <div className="code-scroll" tabIndex={0}>
      {props.children}
    </div>
  );
}

/** Code in a carved well, with a copy button: highlighted HTML, or plain text. */
export function CodeBlock({ html, source }: { html?: string; source: string }) {
  return (
    <div className="code-block carved-carve">
      <CopyButton text={source} />
      {html !== undefined ? (
        <CodeScroll html={html} />
      ) : (
        <CodeScroll>
          <pre>
            <code>{source}</code>
          </pre>
        </CodeScroll>
      )}
    </div>
  );
}

/** A one-line shell command. Long commands wrap rather than scroll. */
export function Command({ children }: { children: string }) {
  return (
    <div className="command carved-carve">
      <code className="command-text">
        <span aria-hidden="true" className="command-prompt">
          ${' '}
        </span>
        {children}
      </code>
      <CopyButton text={children} />
    </div>
  );
}
