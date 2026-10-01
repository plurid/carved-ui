import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  Radio,
  RadioGroup,
  Switch,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Choice/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { children: 'Email me updates' },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox', { name: 'Email me updates' });
    await userEvent.click(box);
    await expect(box).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(box).not.toBeChecked();
  },
};

export const States: Story = {
  render: () => (
    <div className="lab-stack">
      <Checkbox defaultSelected>Selected</Checkbox>
      <Checkbox isIndeterminate>Some projects</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox description="One message a week, at most.">With description</Checkbox>
      <Checkbox isInvalid errorMessage="Accept the terms to continue.">
        I accept the terms
      </Checkbox>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <Form onSubmit={(event) => event.preventDefault()}>
      <CheckboxGroup
        label="Notify me about"
        description="Choose at least one."
        isRequired
        name="topics"
      >
        <Checkbox value="deploys">Deploys</Checkbox>
        <Checkbox value="comments">Comments</Checkbox>
        <Checkbox value="billing">Billing</Checkbox>
      </CheckboxGroup>
      <Button type="submit">Save</Button>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(canvas.getByRole('checkbox', { name: 'Deploys' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Comments' }));
    await expect(canvas.getByRole('checkbox', { name: 'Deploys' })).not.toHaveAttribute(
      'aria-invalid',
    );
  },
};

export const Radios: Story = {
  render: () => (
    <div className="lab-stack">
      <RadioGroup label="Visibility" defaultValue="team" description="You can change this later.">
        <Radio value="private" description="Only you can see it.">
          Private
        </Radio>
        <Radio value="team">Team</Radio>
        <Radio value="public">Public</Radio>
      </RadioGroup>
      <RadioGroup label="Density" orientation="horizontal" defaultValue="cozy">
        <Radio value="compact">Compact</Radio>
        <Radio value="cozy">Cozy</Radio>
        <Radio value="roomy" isDisabled>
          Roomy
        </Radio>
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const team = canvas.getByRole('radio', { name: 'Team' });
    team.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Public' })).toBeChecked();
  },
};

export const Switches: Story = {
  render: () => (
    <div className="lab-stack">
      <Switch>Notifications</Switch>
      <Switch defaultSelected description="Teammates can join without approval.">
        Open invitations
      </Switch>
      <Switch isDisabled>Disabled</Switch>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', { name: 'Notifications' });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};
