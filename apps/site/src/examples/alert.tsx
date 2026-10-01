import { Alert, Button } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack">
      <Alert tone="success" title="Deployed">
        Version 1.4 is live in every region.
      </Alert>
      <Alert tone="warning" title="Storage at 80%">
        At this rate it fills in about nine days.
      </Alert>
      <Alert
        tone="danger"
        title="Deploy failed"
        action={
          <Button size="sm" variant="secondary">
            Retry
          </Button>
        }
      >
        The build step exited with code 1.
      </Alert>
    </div>
  );
}
