import { TextField } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack narrow">
      <TextField
        label="Project name"
        placeholder="Quarry"
        description="Shown to everyone in the workspace."
      />
      <TextField label="Notes" multiline placeholder="What changed in this release?" />
    </div>
  );
}
