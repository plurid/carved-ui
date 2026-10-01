import { Button, IconButton } from '@plurid/carved-ui-react';

const Plus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function Example() {
  return (
    <div className="row">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">
        <Plus />
        New project
      </Button>
      <IconButton aria-label="New project" variant="secondary">
        <Plus />
      </IconButton>
    </div>
  );
}
