import { Switch } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack">
      <Switch defaultSelected>Notifications</Switch>
      <Switch description="Teammates can join without approval.">Open invitations</Switch>
    </div>
  );
}
