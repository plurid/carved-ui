import { useState } from 'react';
import { Calendar, RangeCalendar, useLocale } from '@plurid/carved-ui-react';
import type { DateValue } from '@plurid/carved-ui-react';
import { isWeekend, parseDate } from '@internationalized/date';

export default function Example() {
  const { locale } = useLocale();
  const [day, setDay] = useState<DateValue>(parseDate('2026-03-10'));
  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <Calendar
        aria-label="Delivery day"
        value={day}
        onChange={setDay}
        isDateUnavailable={(date) => isWeekend(date, locale)}
      />
      <RangeCalendar
        aria-label="Trip"
        defaultValue={{ start: parseDate('2026-03-16'), end: parseDate('2026-03-20') }}
      />
    </div>
  );
}
