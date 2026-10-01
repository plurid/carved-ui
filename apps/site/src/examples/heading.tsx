import { Heading, Separator } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack">
      <Heading level={2} variant="engraved">
        Quarry
      </Heading>
      <Separator variant="trench" />
      <Heading level={2} variant="display">
        Ship on Fridays.
      </Heading>
      <Separator />
      <Heading level={3}>A regular section heading</Heading>
    </div>
  );
}
