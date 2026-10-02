import { useState, useSyncExternalStore } from 'react';
import {
  Button,
  CommandItem,
  CommandPalette,
  CommandSection,
  DialogTrigger,
  Kbd,
} from '@plurid/carved-ui-react';
import type { Key } from '@plurid/carved-ui-react';

const unchanging = () => () => {};

/** The palette's shortcut on this platform: ⌘K on Apple devices, Ctrl+K elsewhere. */
function useShortcut() {
  // The platform is known only in the browser: the server renders no hint, and the browser
  // adds it once the page is running.
  const apple = useSyncExternalStore(
    unchanging,
    () => /mac|iphone|ipad/i.test(navigator.platform),
    () => null,
  );
  if (apple === null) return null;
  return apple ? { label: '⌘K', keys: 'Meta+K' } : { label: 'Ctrl K', keys: 'Control+K' };
}

export default function Example() {
  const [ran, setRan] = useState<Key | null>(null);
  const shortcut = useShortcut();
  return (
    <div className="row">
      <DialogTrigger>
        <Button variant="secondary" aria-keyshortcuts={shortcut?.keys}>
          Search commands
          {shortcut && <Kbd aria-hidden="true">{shortcut.label}</Kbd>}
        </Button>
        <CommandPalette onAction={setRan}>
          <CommandSection title="Project">
            <CommandItem id="new">New project</CommandItem>
            <CommandItem id="invite">Invite people</CommandItem>
            <CommandItem id="archive">Archive project</CommandItem>
          </CommandSection>
          <CommandSection title="Go to">
            <CommandItem id="settings">Settings</CommandItem>
            <CommandItem id="billing">Billing</CommandItem>
            <CommandItem id="docs">Documentation</CommandItem>
          </CommandSection>
        </CommandPalette>
      </DialogTrigger>
      <output className="muted">
        {ran ? `Ran “${ran}”` : shortcut && `Or press ${shortcut.label} anywhere`}
      </output>
    </div>
  );
}
