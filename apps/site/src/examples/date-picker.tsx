import { DatePicker, DateRangePicker, useLocale } from '@plurid/carved-ui-react';
import { getLocalTimeZone, isWeekend, today } from '@internationalized/date';

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
        allowsNonContiguousRanges
        description="A range may span weekends; they are not counted."
      />
    </div>
  );
}
