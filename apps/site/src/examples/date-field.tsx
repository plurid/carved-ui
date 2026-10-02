import { DateField, TimeField } from '@plurid/carved-ui-react';
import { parseDate, parseTime } from '@internationalized/date';

export default function Example() {
  return (
    <div className="stack narrow">
      <DateField label="Date of birth" defaultValue={parseDate('1992-06-14')} />
      <TimeField label="Daily standup" defaultValue={parseTime('09:30')} />
    </div>
  );
}
