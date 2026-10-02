import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@plurid/carved-ui-react';
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

/**
 * Code in a carved well, with a copy button: highlighted HTML, or plain text. Code longer than
 * `foldAfter` lines folds to its first lines, with a button to show the rest.
 */
export function CodeBlock({
  html,
  source,
  foldAfter,
}: {
  html?: string;
  source: string;
  foldAfter?: number;
}) {
  const expandable = foldAfter !== undefined && source.split('\n').length > foldAfter;
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="code-block carved-carve"
      data-expandable={expandable || undefined}
      data-collapsed={(expandable && !expanded) || undefined}
    >
      <CopyButton text={source} />
      {expandable && (
        <Button
          variant="secondary"
          size="sm"
          className="code-expand"
          aria-expanded={expanded}
          onPress={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Show all code'}
        </Button>
      )}
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
