import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { parseDate, parseTime } from '@internationalized/date';
import {
  Calendar,
  DateField,
  DatePicker,
  DateRangePicker,
  RangeCalendar,
  TimeField,
} from '@plurid/carved-ui-react';
import type { DateValue } from '@plurid/carved-ui-react';

const meta = {
  title: 'Fields/Dates',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="lab-narrow lab-tall">{Story()}</div>],
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Picker: Story = {
  render: () => {
    const [value, setValue] = useState<DateValue | null>(parseDate('2026-03-10'));
    return (
      <div className="lab-stack">
        <DatePicker label="Launch date" value={value} onChange={setValue} />
        <output aria-label="Chosen date">{value?.toString()}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Calendar/ }));
    const body = within(canvasElement.ownerDocument.body);
    const day = await body.findByRole('button', { name: /March 15, 2026/ });
    await userEvent.click(day);
    await expect(canvas.getByLabelText('Chosen date')).toHaveTextContent('2026-03-15');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const Range: Story = {
  render: () => (
    <DateRangePicker
      label="Time off"
      defaultValue={{ start: parseDate('2026-07-06'), end: parseDate('2026-07-10') }}
      description="Weekdays only."
    />
  ),
};

export const Limits: Story = {
  render: () => (
    <DatePicker
      label="Delivery"
      minValue={parseDate('2026-03-05')}
      defaultValue={parseDate('2026-03-02')}
      description="Deliveries start on March 5."
    />
  ),
};

export const Typed: Story = {
  render: () => {
    const [value, setValue] = useState<DateValue | null>(null);
    return (
      <div className="lab-stack">
        <DateField label="Date of birth" value={value} onChange={setValue} />
        <TimeField label="Standup" defaultValue={parseTime('09:30')} />
        <output aria-label="Typed date">{value?.toString()}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [month] = canvas.getAllByRole('spinbutton');
    await userEvent.click(month!);
    await userEvent.keyboard('06141992');
    await expect(canvas.getByLabelText('Typed date')).toHaveTextContent('1992-06-14');
  },
};

export const Calendars: Story = {
  decorators: [(Story) => <div className="lab-row">{Story()}</div>],
  render: () => {
    const [day, setDay] = useState<DateValue>(parseDate('2026-03-10'));
    return (
      <>
        <Calendar aria-label="Delivery day" value={day} onChange={setDay} />
        <RangeCalendar
          aria-label="Trip"
          defaultValue={{ start: parseDate('2026-03-12'), end: parseDate('2026-03-17') }}
        />
        <output aria-label="Delivery day">{day.toString()}</output>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [calendar] = canvas.getAllByRole('application');
    within(calendar!)
      .getByRole('button', { name: /March 10, 2026/ })
      .focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(canvas.getByLabelText('Delivery day', { selector: 'output' })).toHaveTextContent(
      '2026-03-11',
    );
  },
};
