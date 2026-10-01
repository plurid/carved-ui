// @source ../../../../../docs/examples/app-shell.tsx
import { AppShell } from '../../../../../docs/examples/app-shell';
import { EmptyState } from '../../../../../docs/examples/empty-state';
import { Button } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <AppShell title="Projects">
      <EmptyState title="No projects yet" action={<Button>Create a project</Button>}>
        Projects you create or join appear here.
      </EmptyState>
    </AppShell>
  );
}
