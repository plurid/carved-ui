import { useMemo } from 'react';
import { useLocale } from '@plurid/carved-ui-react';
import { NOW } from './random';

const day = (time: number) => new Date(time).toISOString().slice(0, 10);

/**
 * Formats the apps' times in the reader's language. Times are shown in UTC, so the page reads
 * the same wherever it is rendered.
 */
export function useTimes() {
  const { locale } = useLocale();
  return useMemo(() => {
    const zone = { timeZone: 'UTC' } as const;
    const clock = new Intl.DateTimeFormat(locale, { ...zone, hour: 'numeric', minute: '2-digit' });
    const date = new Intl.DateTimeFormat(locale, { ...zone, month: 'short', day: 'numeric' });
    const dated = new Intl.DateTimeFormat(locale, { ...zone, dateStyle: 'medium' });
    const full = new Intl.DateTimeFormat(locale, {
      ...zone,
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    return {
      /** A time today, a day this year, or a date: as short as it can be told. */
      short(time: number) {
        if (day(time) === day(NOW)) return clock.format(time);
        if (day(time).slice(0, 4) === day(NOW).slice(0, 4)) return date.format(time);
        return dated.format(time);
      },
      full: (time: number) => full.format(time),
      /** How long ago, such as "3 hours ago". */
      ago(time: number) {
        const minutes = Math.round((time - NOW) / 60_000);
        if (Math.abs(minutes) < 60) return relative.format(minutes, 'minute');
        const hours = Math.round(minutes / 60);
        if (Math.abs(hours) < 24) return relative.format(hours, 'hour');
        return relative.format(Math.round(hours / 24), 'day');
      },
    };
  }, [locale]);
}
