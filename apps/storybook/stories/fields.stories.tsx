import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Button,
  Description,
  FieldButton,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  SearchField,
  Slider,
  TextField,
  TextFieldRoot,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Fields/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Project name', placeholder: 'Quarry' },
  decorators: [(Story) => <div className="lab-narrow">{Story()}</div>],
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Project name' });
    await userEvent.type(input, 'Basalt');
    await expect(input).toHaveValue('Basalt');
  },
};

export const WithDescription: Story = {
  args: { description: 'Shown to everyone in the workspace.' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox');
    await expect(input).toHaveAccessibleDescription('Shown to everyone in the workspace.');
  },
};

export const Multiline: Story = {
  args: { label: 'Notes', multiline: true, placeholder: 'What changed?' },
};

export const States: Story = {
  render: () => (
    <div className="lab-stack">
      <TextField label="Disabled" defaultValue="Locked" isDisabled />
      <TextField label="Read only" defaultValue="Granite" isReadOnly />
      <TextField
        label="Invalid"
        defaultValue="x"
        isInvalid
        errorMessage="Use at least three characters."
      />
    </div>
  ),
};

export const Validation: Story = {
  render: () => {
    const [submitted, setSubmitted] = useState('');
    return (
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('email')));
        }}
      >
        <TextField
          label="Email"
          name="email"
          type="email"
          isRequired
          description="We send receipts here."
        />
        <Button type="submit">Save</Button>
        <output aria-label="Submitted email">{submitted}</output>
      </Form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByRole('textbox', { name: 'Email' });
    await userEvent.type(email, 'invalid');
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await userEvent.clear(email);
    await userEvent.type(email, 'team@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(canvas.getByLabelText('Submitted email')).toHaveTextContent('team@example.com');
  },
};

export const Search: Story = {
  render: () => <SearchField label="Search projects" placeholder="Name or owner" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Search projects' });
    await userEvent.type(input, 'granite');
    await userEvent.click(canvas.getByRole('button', { name: /clear/i }));
    await expect(input).toHaveValue('');
  },
};

/** Arrange the parts yourself with `TextFieldRoot`. */
export const CustomLayout: Story = {
  render: () => {
    const onCopy = fn();
    return (
      <TextFieldRoot defaultValue="https://quarry.example/invite/7c1f" isReadOnly>
        <Label>Invite link</Label>
        <InputGroup>
          <Input className="carved-group-input" />
          <FieldButton onPress={onCopy}>Copy</FieldButton>
        </InputGroup>
        <Description>Anyone with the link can join as a viewer.</Description>
        <FieldError />
      </TextFieldRoot>
    );
  },
};

export const Sliders: Story = {
  render: () => (
    <div className="lab-stack">
      <Slider label="Volume" defaultValue={40} />
      <Slider
        label="Price range"
        defaultValue={[20, 80]}
        thumbLabels={['Minimum', 'Maximum']}
        formatOptions={{ style: 'currency', currency: 'EUR' }}
      />
      <Slider label="Disabled" defaultValue={30} isDisabled />
      <Slider label="Vertical" defaultValue={60} orientation="vertical" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', { name: 'Volume' });
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveValue('41');
  },
};
