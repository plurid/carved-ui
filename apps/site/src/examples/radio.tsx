import { Radio, RadioGroup } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <RadioGroup label="Visibility" defaultValue="team">
      <Radio value="private" description="Only you can see it.">
        Private
      </Radio>
      <Radio value="team" description="Everyone in the workspace.">
        Team
      </Radio>
      <Radio value="public" description="Anyone with the link.">
        Public
      </Radio>
    </RadioGroup>
  );
}
