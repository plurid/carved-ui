import { useEffect, useState } from 'react';
import { Button } from '@plurid/carved-ui-react';

/** Copies text to the clipboard and says so. */
export function CopyButton({
  text,
  label = 'Copy',
}: {
  text: string | (() => string);
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <Button
      size="sm"
      variant="ghost"
      className="copy-button"
      onPress={async () => {
        await navigator.clipboard.writeText(typeof text === 'function' ? text() : text);
        setCopied(true);
      }}
    >
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </Button>
  );
}
