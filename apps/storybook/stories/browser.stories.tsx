import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Select,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  Combobox,
} from '@plurid/carved-ui-react';
const meta = { title: 'Testing/Browser', tags: ['!autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
function Controls() {
  const [submitted, setSubmitted] = useState('');
  const [selection, setSelection] = useState<string | number | null>(null);
  return (
    <div className="lab-stack lab-field">
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('email')));
        }}
        onReset={() => setSubmitted('')}
      >
        <TextField name="email" type="email" isRequired defaultValue="team@example.com">
          <Label>Email</Label>
          <Input />
          <FieldError />
        </TextField>
        <Checkbox name="updates" defaultSelected>
          Project updates
        </Checkbox>
        <RadioGroup name="access" defaultValue="private">
          <Label>Access</Label>
          <Radio value="private">Private</Radio>
          <Radio value="team">Team</Radio>
          <Radio value="public" isDisabled>
            Public
          </Radio>
        </RadioGroup>
        <Switch name="notifications">Notifications</Switch>
        <div className="lab-row">
          <Button type="submit">Save</Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
          <Button isDisabled>Unavailable</Button>
        </div>
        <output aria-label="Submitted email">{submitted}</output>
      </Form>
      <Slider defaultValue={40}>
        <Label>Volume</Label>
        <SliderOutput />
        <SliderTrack>
          <SliderThumb />
        </SliderTrack>
      </Slider>
      <Tabs>
        <TabList aria-label="Project">
          <Tab id="overview">Overview</Tab>
          <Tab id="activity">Activity</Tab>
          <Tab id="settings" isDisabled>
            Settings
          </Tab>
        </TabList>
        <TabPanel id="overview">Project overview.</TabPanel>
        <TabPanel id="activity">Recent activity.</TabPanel>
      </Tabs>
      <Select selectedKey={selection} onSelectionChange={setSelection}>
        <Label>Workspace</Label>
        <Button variant="secondary">
          <SelectValue />
        </Button>
        <Popover>
          <ListBox>
            <ListBoxItem id="design">Design</ListBoxItem>
            <ListBoxItem id="engineering">Engineering</ListBoxItem>
            <ListBoxItem id="archive" isDisabled>
              Archive
            </ListBoxItem>
          </ListBox>
        </Popover>
      </Select>
      <output aria-label="Selected workspace">{selection ?? 'None'}</output>
      <Combobox>
        <Label>Find project</Label>
        <Input />
        <Button aria-label="Show projects" variant="ghost">
          Show
        </Button>
        <Popover>
          <ListBox>
            <ListBoxItem id="carved">Carved UI</ListBoxItem>
            <ListBoxItem id="docs">Documentation</ListBoxItem>
          </ListBox>
        </Popover>
      </Combobox>
    </div>
  );
}
export const ControlsControl: Story = { render: () => <Controls /> };
