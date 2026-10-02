'use client';
import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  DateSegment,
} from 'react-aria-components/DateField';
import type {
  DateFieldProps as AriaDateFieldProps,
  DateInputProps as AriaDateInputProps,
  DateValue,
} from 'react-aria-components/DateField';
import { TimeField as AriaTimeField } from 'react-aria-components/TimeField';
import type {
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue,
} from 'react-aria-components/TimeField';
import { DatePicker as AriaDatePicker } from 'react-aria-components/DatePicker';
import type { DatePickerProps as AriaDatePickerProps } from 'react-aria-components/DatePicker';
import { DateRangePicker as AriaDateRangePicker } from 'react-aria-components/DateRangePicker';
import type { DateRangePickerProps as AriaDateRangePickerProps } from 'react-aria-components/DateRangePicker';
import {
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
} from 'react-aria-components/Calendar';
import type { CalendarProps as AriaCalendarProps } from 'react-aria-components/Calendar';
import { RangeCalendar as AriaRangeCalendar } from 'react-aria-components/RangeCalendar';
import type { RangeCalendarProps as AriaRangeCalendarProps } from 'react-aria-components/RangeCalendar';
import { Text } from 'react-aria-components/Text';
import type { ReactNode, Ref } from 'react';
import { FieldButton, FieldFooter, InputGroup, Label } from './fields.js';
import type { FieldProps } from './fields.js';
import { Dialog, Popover } from './overlays.js';
import { DepthScope, useCutDepth } from './provider.js';
import { withClass } from './internal/class-names.js';
import { CalendarIcon, ChevronEnd, ChevronStart } from './internal/icons.js';

export interface DateInputProps extends Omit<AriaDateInputProps, 'children'> {
  /** Renders each segment. Defaults to Carved's segments. */
  children?: AriaDateInputProps['children'];
  ref?: Ref<HTMLDivElement>;
}

/**
 * The editable segments of a date or time: day, month, year, hour and so on, ordered and
 * punctuated for the locale. Each segment is typed into or stepped with the arrow keys.
 */
export function DateInput({ className, children, ...props }: DateInputProps) {
  return (
    <AriaDateInput {...props} className={withClass('carved-date-input', className)}>
      {children ?? ((segment) => <DateSegment segment={segment} className="carved-date-segment" />)}
    </AriaDateInput>
  );
}

/** The well that a lone date or time input is cut into. */
const well = 'carved-input-group carved-date-well carved-carve';

export interface DateFieldProps<T extends DateValue>
  extends Omit<AriaDateFieldProps<T>, 'children'>, FieldProps {
  ref?: Ref<HTMLDivElement>;
}

/** A labelled date, typed segment by segment. Pass a `CalendarDateTime` value to add a time. */
export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: DateFieldProps<T>) {
  return (
    <AriaDateField {...props} className={withClass('carved-field', className)}>
      {label && <Label>{label}</Label>}
      <DateInput className={well} />
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaDateField>
  );
}

export interface TimeFieldProps<T extends TimeValue>
  extends Omit<AriaTimeFieldProps<T>, 'children'>, FieldProps {
  ref?: Ref<HTMLDivElement>;
}

/** A labelled time of day, in the locale's 12 or 24 hour clock. */
export function TimeField<T extends TimeValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: TimeFieldProps<T>) {
  return (
    <AriaTimeField {...props} className={withClass('carved-field', className)}>
      {label && <Label>{label}</Label>}
      <DateInput className={well} />
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaTimeField>
  );
}

export interface DatePickerProps<T extends DateValue>
  extends Omit<AriaDatePickerProps<T>, 'children'>, FieldProps {
  ref?: Ref<HTMLDivElement>;
}

/** A date field with a calendar that opens from its button, one level deeper than the field. */
export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker {...props} className={withClass('carved-field carved-date-picker', className)}>
      {label && <Label>{label}</Label>}
      <InputGroup>
        <DateInput className="carved-group-input" />
        <FieldButton>
          <CalendarIcon />
        </FieldButton>
      </InputGroup>
      <FieldFooter description={description} errorMessage={errorMessage} />
      <Popover placement="bottom end" className="carved-calendar-popover">
        <Dialog>
          <AriaCalendar className="carved-calendar">
            <CalendarParts />
          </AriaCalendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}

export interface DateRangePickerProps<T extends DateValue>
  extends Omit<AriaDateRangePickerProps<T>, 'children'>, FieldProps {
  ref?: Ref<HTMLDivElement>;
}

/** A start and end date in one field, with a calendar for choosing the range. */
export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: DateRangePickerProps<T>) {
  return (
    <AriaDateRangePicker
      {...props}
      className={withClass('carved-field carved-date-picker', className)}
    >
      {label && <Label>{label}</Label>}
      <InputGroup>
        <DateInput slot="start" className="carved-group-input carved-date-range-start" />
        <span aria-hidden="true" className="carved-date-range-dash">
          –
        </span>
        <DateInput slot="end" className="carved-group-input" />
        <FieldButton>
          <CalendarIcon />
        </FieldButton>
      </InputGroup>
      <FieldFooter description={description} errorMessage={errorMessage} />
      <Popover placement="bottom end" className="carved-calendar-popover">
        <Dialog>
          <AriaRangeCalendar className="carved-calendar carved-range-calendar">
            <CalendarParts />
          </AriaRangeCalendar>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}

/** The month heading with its arrows, then one grid per visible month. */
function CalendarParts({
  months = 1,
  errorMessage,
}: {
  months?: number;
  errorMessage?: ReactNode;
}) {
  return (
    <>
      <div className="carved-calendar-header">
        <FieldButton slot="previous">
          <ChevronStart />
        </FieldButton>
        <CalendarHeading className="carved-calendar-heading" />
        <FieldButton slot="next">
          <ChevronEnd />
        </FieldButton>
      </div>
      <div className="carved-calendar-months">
        {Array.from({ length: months }, (_, month) => (
          <CalendarGrid
            key={month}
            offset={month ? { months: month } : undefined}
            className="carved-calendar-grid"
          >
            <CalendarGridHeader>
              {(day) => (
                <CalendarHeaderCell className="carved-calendar-weekday">{day}</CalendarHeaderCell>
              )}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => <CalendarCell date={date} className="carved-calendar-day carved-carve" />}
            </CalendarGridBody>
          </CalendarGrid>
        ))}
      </div>
      {errorMessage && (
        <Text slot="errorMessage" className="carved-field-error">
          {errorMessage}
        </Text>
      )}
    </>
  );
}

interface CalendarExtras {
  /** Shown below the grid when the calendar is invalid, such as for an unavailable date. */
  errorMessage?: ReactNode;
}

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, 'children'>, CalendarExtras {
  ref?: Ref<HTMLDivElement>;
}

/**
 * A month of days cut into a well. The chosen day is inlaid and today is marked in the
 * accent. Set `visibleDuration={{ months: 2 }}` to show months side by side.
 */
export function Calendar<T extends DateValue>({
  errorMessage,
  className,
  ...props
}: CalendarProps<T>) {
  const depth = useCutDepth();
  return (
    <AriaCalendar
      {...props}
      data-carved-depth={depth}
      className={withClass('carved-calendar carved-calendar-well carved-carve', className)}
    >
      <DepthScope depth={depth}>
        <CalendarParts months={props.visibleDuration?.months} errorMessage={errorMessage} />
      </DepthScope>
    </AriaCalendar>
  );
}

export interface RangeCalendarProps<T extends DateValue>
  extends Omit<AriaRangeCalendarProps<T>, 'children'>, CalendarExtras {
  ref?: Ref<HTMLDivElement>;
}

/** A calendar for choosing a span of days: its ends are inlaid, the days between cut a band. */
export function RangeCalendar<T extends DateValue>({
  errorMessage,
  className,
  ...props
}: RangeCalendarProps<T>) {
  const depth = useCutDepth();
  return (
    <AriaRangeCalendar
      {...props}
      data-carved-depth={depth}
      className={withClass(
        'carved-calendar carved-range-calendar carved-calendar-well carved-carve',
        className,
      )}
    >
      <DepthScope depth={depth}>
        <CalendarParts months={props.visibleDuration?.months} errorMessage={errorMessage} />
      </DepthScope>
    </AriaRangeCalendar>
  );
}
