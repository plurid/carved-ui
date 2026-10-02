import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Separator, ToggleButton, Toolbar } from '@plurid/carved-ui-react';

const meta = {
  title: 'Actions/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Toolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Formatting: Story = {
  decorators: [(Story) => <div style={{ inlineSize: 'max-content' }}>{Story()}</div>],
  render: () => (
    <Toolbar aria-label="Text formatting">
      <ToggleButton size="sm" aria-label="Bold">
        <b>B</b>
      </ToggleButton>
      <ToggleButton size="sm" aria-label="Italic">
        <i>I</i>
      </ToggleButton>
      <Separator orientation="vertical" />
      <Button size="sm" variant="ghost">
        Link
      </Button>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Italic' })).toHaveFocus();
    // The divider is skipped.
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Link' })).toHaveFocus();
  },
};
