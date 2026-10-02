import { DatePicker, DateRangePicker } from '@plurid/carved-ui-react';
import { getLocalTimeZone, isWeekend, today } from '@internationalized/date';
import { useLocale } from 'react-aria-components';

export default function Example() {
  const { locale } = useLocale();
  return (
    <div className="stack narrow">
      <DatePicker
        label="Launch date"
        minValue={today(getLocalTimeZone())}
        description="Any day from today."
      />
      <DateRangePicker
        label="Time off"
        isDateUnavailable={(date) => isWeekend(date, locale)}
        description="Weekends are not counted."
      />
    </div>
  );
}
