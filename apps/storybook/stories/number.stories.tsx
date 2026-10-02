import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Fieldset, NumberField, TextField } from '@plurid/carved-ui-react';

const meta = {
  title: 'Fields/Number field',
  component: NumberField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="lab-narrow">{Story()}</div>],
} satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Numbers: Story = {
  render: () => (
    <div className="lab-stack">
      <NumberField label="Seats" defaultValue={4} minValue={1} maxValue={5} />
      <NumberField
        label="Discount"
        defaultValue={0.15}
        step={0.05}
        formatOptions={{ style: 'percent' }}
      />
      <NumberField
        label="Budget"
        defaultValue={1200}
        formatOptions={{ style: 'currency', currency: 'EUR' }}
        isInvalid
        errorMessage="Budgets above €1,000 need approval."
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const seats = canvas.getByRole('textbox', { name: 'Seats' });
    const increase = canvas.getAllByRole('button', { name: /Increase/ })[0]!;
    await userEvent.click(increase);
    await expect(seats).toHaveValue('5');
    await expect(increase).toBeDisabled();
    seats.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(seats).toHaveValue('3');
  },
};

export const Grouped: Story = {
  render: () => (
    <Fieldset legend="Billing address">
      <TextField label="Street" />
      <TextField label="City" />
    </Fieldset>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('group', { name: 'Billing address' }),
    ).toBeVisible();
  },
};
