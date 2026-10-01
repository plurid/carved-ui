import { Button } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="row">
      <Button>Save changes</Button>
      <Button variant="secondary">Preview</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger">Delete</Button>
    </div>
  );
}
