// @source ../../../../../docs/examples/app-shell.tsx
import { Workspace } from '../../../../../docs/examples/app-shell';
import { EmptyState } from '../../../../../docs/examples/empty-state';
import { Button } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    // Shown inside this page, so the frame leaves the page's landmarks to it.
    <Workspace title="Projects" landmarks={false} collapse="sm" style={{ blockSize: '30rem' }}>
      <EmptyState title="No projects yet" action={<Button>Create a project</Button>}>
        Projects you create or join appear here.
      </EmptyState>
    </Workspace>
  );
}
