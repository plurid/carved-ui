import { useState } from 'react';
import {
  Button,
  CommandItem,
  CommandPalette,
  CommandSection,
  DialogTrigger,
  Kbd,
} from '@plurid/carved-ui-react';
import type { Key } from '@plurid/carved-ui-react';

export default function Example() {
  const [ran, setRan] = useState<Key | null>(null);
  return (
    <div className="row">
      <DialogTrigger>
        <Button variant="secondary">
          Search commands <Kbd>⌘K</Kbd>
        </Button>
        <CommandPalette onAction={setRan}>
          <CommandSection title="Project">
            <CommandItem id="new" shortcut="⌘N">
              New project
            </CommandItem>
            <CommandItem id="invite">Invite people</CommandItem>
            <CommandItem id="archive">Archive project</CommandItem>
          </CommandSection>
          <CommandSection title="Go to">
            <CommandItem id="settings" shortcut="⌘,">
              Settings
            </CommandItem>
            <CommandItem id="billing">Billing</CommandItem>
            <CommandItem id="docs">Documentation</CommandItem>
          </CommandSection>
        </CommandPalette>
      </DialogTrigger>
      <output className="muted">{ran ? `Ran “${ran}”` : 'Press ⌘K or Ctrl+K anywhere'}</output>
    </div>
  );
}
