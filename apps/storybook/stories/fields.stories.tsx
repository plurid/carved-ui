import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Form,
  TextField,
  Input,
  Textarea,
  Label,
  FieldDescription,
  FieldError,
  Button,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
} from '@plurid/carved-ui-react';
const meta = { title: 'Forms/Controls', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
function ControlledInput() {
  const [value, setValue] = useState('Carved');
  return (
    <div className="lab-stack lab-field">
      <TextField value={value} onChange={setValue}>
        <Label>Project name</Label>
        <Input />
        <FieldDescription>Choose a name your team recognizes.</FieldDescription>
      </TextField>
      <Button onPress={() => setValue('Updated externally')}>Update value</Button>
      <output aria-label="Current name">{value}</output>
    </div>
  );
}
export const Controlled: Story = {
  render: () => <ControlledInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Project name' });
    await expect(input).toHaveValue('Carved');
    await userEvent.clear(input);
    await userEvent.type(input, 'New project');
    await expect(canvas.getByLabelText('Current name')).toHaveTextContent('New project');
    await userEvent.click(canvas.getByRole('button', { name: 'Update value' }));
    await expect(input).toHaveValue('Updated externally');
  },
};
export const InputStates: Story = {
  render: () => (
    <div className="lab-stack lab-field">
      <TextField>
        <Label>Email address</Label>
        <Input type="email" placeholder="name@example.com" />
        <FieldDescription>We use this address for account notifications.</FieldDescription>
      </TextField>
      <TextField isDisabled defaultValue="Unavailable">
        <Label>Disabled field</Label>
        <Input />
      </TextField>
      <TextField isReadOnly defaultValue="Readable and selectable">
        <Label>Read-only field</Label>
        <Input />
      </TextField>
      <TextField isInvalid>
        <Label>Invalid field</Label>
        <Input />
        <FieldError>Enter a valid value.</FieldError>
      </TextField>
    </div>
  ),
};
export const Multiline: Story = {
  render: () => (
    <TextField className="lab-field">
      <Label>Project description</Label>
      <Textarea placeholder="What is this project for?" />
      <FieldDescription>A short description helps your team.</FieldDescription>
    </TextField>
  ),
};
function Submission() {
  const [submitted, setSubmitted] = useState('');
  return (
    <Form
      className="lab-field"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get('email')));
      }}
    >
      <TextField name="email" isRequired type="email" defaultValue="">
        <Label>Email</Label>
        <Input />
        <FieldError />
      </TextField>
      <div className="lab-row">
        <Button type="submit">Subscribe</Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
      <output aria-label="Submitted email">{submitted}</output>
    </Form>
  );
}
export const ValidationAndReset: Story = {
  render: () => <Submission />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }));
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await expect(input).toBeInvalid();
    await userEvent.type(input, 'team@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }));
    await expect(canvas.getByLabelText('Submitted email')).toHaveTextContent('team@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(input).toHaveValue('');
  },
};
export const Checkboxes: Story = {
  render: () => (
    <div className="lab-stack">
      <Checkbox>Send notifications</Checkbox>
      <Checkbox defaultSelected>Share with the team</Checkbox>
      <Checkbox isIndeterminate>Some projects selected</Checkbox>
      <Checkbox isDisabled>Unavailable option</Checkbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Send notifications' });
    checkbox.focus();
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
  },
};
export const Radios: Story = {
  render: () => (
    <RadioGroup defaultValue="private">
      <Label>Project visibility</Label>
      <Radio value="private">Private</Radio>
      <Radio value="team">Team</Radio>
      <Radio value="public" isDisabled>
        Public
      </Radio>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('radio', { name: 'Private' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Team' })).toBeChecked();
  },
};
export const Switches: Story = {
  render: () => (
    <div className="lab-stack">
      <Switch>Enable autosave</Switch>
      <Switch defaultSelected>Use compact navigation</Switch>
      <Switch isDisabled>Unavailable setting</Switch>
    </div>
  ),
};
export const Sliders: Story = {
  render: () => (
    <div className="lab-stack lab-field">
      <Slider defaultValue={40}>
        <Label>Volume</Label>
        <SliderOutput />
        <SliderTrack>
          <SliderThumb />
        </SliderTrack>
      </Slider>
      <Slider defaultValue={[20, 80]}>
        <Label>Selected range</Label>
        <SliderOutput />
        <SliderTrack>
          <SliderThumb index={0} aria-label="Minimum" />
          <SliderThumb index={1} aria-label="Maximum" />
        </SliderTrack>
      </Slider>
      <Slider isDisabled defaultValue={50}>
        <Label>Disabled volume</Label>
        <SliderTrack>
          <SliderThumb />
        </SliderTrack>
      </Slider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', { name: 'Volume' });
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveValue('41');
  },
};
function RefExample() {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="lab-stack lab-field">
      <TextField>
        <Label>Focused through a ref</Label>
        <Input ref={ref} />
      </TextField>
      <Button onPress={() => ref.current?.focus()}>Focus input</Button>
    </div>
  );
}
export const DomRef: Story = {
  render: () => <RefExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Focus input' }));
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};
