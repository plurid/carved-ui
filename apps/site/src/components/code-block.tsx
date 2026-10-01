import { CopyButton } from './copy-button';

/** Highlighted code in a carved well, with a copy button. */
export function CodeBlock({
  html,
  source,
  label,
}: {
  html: string;
  source: string;
  label?: string;
}) {
  return (
    <div className="code-block carved-carve">
      {label && <span className="code-label">{label}</span>}
      <CopyButton text={source} />
      <div className="code-scroll" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/** A one-line shell command. */
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
