import { NumberField } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack narrow">
      <NumberField label="Seats" defaultValue={4} minValue={1} maxValue={50} />
      <NumberField
        label="Discount"
        defaultValue={0.15}
        step={0.05}
        minValue={0}
        maxValue={1}
        formatOptions={{ style: 'percent' }}
      />
      <NumberField
        label="Monthly budget"
        defaultValue={1200}
        minValue={0}
        formatOptions={{ style: 'currency', currency: 'EUR' }}
        description="Billing stops at this amount."
      />
    </div>
  );
}
