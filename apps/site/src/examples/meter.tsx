import { Meter } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack narrow">
      <Meter label="Storage" value={42} valueLabel="42 of 100 GB" />
      <Meter label="Seats used" value={9} maxValue={10} tone="warning" />
      <Meter label="Error budget spent" value={97} tone="danger" />
    </div>
  );
}
