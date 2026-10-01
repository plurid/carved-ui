import { Avatar, Badge } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack">
      <div className="row">
        <Badge>Draft</Badge>
        <Badge tone="accent">New</Badge>
        <Badge tone="success">Live</Badge>
        <Badge tone="warning">Degraded</Badge>
        <Badge tone="danger">Failed</Badge>
      </div>
      <div className="row">
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Alan Turing" size="lg" />
      </div>
    </div>
  );
}
