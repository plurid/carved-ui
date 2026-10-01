import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, IconButton, Link, ToggleButton, ToggleButtonGroup } from '@plurid/carved-ui-react';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { children: 'Save changes', onPress: fn() },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Save changes' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onPress).toHaveBeenCalledTimes(2);
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="lab-row">
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Delete
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="lab-row">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Pending: Story = {
  args: { isPending: true, children: 'Saving' },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button');
    await userEvent.click(button);
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { isDisabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button')).toBeDisabled();
  },
};

export const LongLabel: Story = {
  args: { children: 'Publish every pending change to production' },
};

const Plus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const WithIcon: Story = {
  render: (args) => (
    <div className="lab-row">
      <Button {...args}>
        <Plus />
        New project
      </Button>
      <IconButton aria-label="Add project">
        <Plus />
      </IconButton>
      <IconButton aria-label="Add project" variant="secondary" size="sm">
        <Plus />
      </IconButton>
    </div>
  ),
};

export const Links: Story = {
  render: () => (
    <div className="lab-stack">
      <p>
        Read the <Link href="#guide">getting started guide</Link> before your first deploy.
      </p>
      <div className="lab-row">
        <Link href="#docs" variant="primary">
          Open the docs
        </Link>
        <Link href="#source" variant="secondary">
          View source
        </Link>
        <Link isDisabled>Unavailable</Link>
      </div>
    </div>
  ),
};

export const Toggles: Story = {
  render: () => (
    <div className="lab-stack">
      <ToggleButton defaultSelected>Pinned</ToggleButton>
      <ToggleButtonGroup
        aria-label="Alignment"
        selectionMode="single"
        defaultSelectedKeys={['start']}
        disallowEmptySelection
      >
        <ToggleButton id="start" size="sm">
          Start
        </ToggleButton>
        <ToggleButton id="center" size="sm">
          Center
        </ToggleButton>
        <ToggleButton id="end" size="sm">
          End
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pinned = canvas.getByRole('button', { name: 'Pinned' });
    await expect(pinned).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(pinned);
    await expect(pinned).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(canvas.getByRole('radio', { name: 'End' }));
    await expect(canvas.getByRole('radio', { name: 'End' })).toBeChecked();
  },
};
