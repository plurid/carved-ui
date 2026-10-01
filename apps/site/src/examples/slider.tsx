import { Slider } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack narrow">
      <Slider label="Volume" defaultValue={40} />
      <Slider
        label="Budget"
        defaultValue={[200, 650]}
        minValue={0}
        maxValue={1000}
        step={50}
        thumbLabels={['Minimum', 'Maximum']}
        formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
      />
    </div>
  );
}
