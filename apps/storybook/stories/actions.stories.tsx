import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, IconButton, Link, Spinner } from '@plurid/carved-ui-react';
const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Save changes', onPress: fn() },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Save changes' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onPress).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(args.onPress).toHaveBeenCalledTimes(2);
  },
};
export const Variants: Story = {
  render: () => (
    <div className="lab-row">
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="lab-row">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};
export const Disabled: Story = {
  args: { isDisabled: true },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};
export const Pending: Story = {
  args: {
    isPending: true,
    children: (
      <>
        <Spinner aria-label="Saving" />
        Saving changes
      </>
    ),
  },
};
export const LongLabel: Story = {
  args: { children: 'Save these changes and return to the project overview' },
};
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
        </svg>
        Add project
      </>
    ),
  },
};
export const IconOnly: Story = {
  render: () => (
    <IconButton aria-label="Add project">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
      </svg>
    </IconButton>
  ),
};
export const Links: Story = {
  render: () => (
    <div className="lab-row">
      <Link href="#details">View details</Link>
      <Link href="#details" variant="secondary">
        Open project
      </Link>
      <Link isDisabled>Unavailable</Link>
    </div>
  ),
};
