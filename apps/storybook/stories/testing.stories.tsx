import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  CarvedProvider,
  Checkbox,
  ComboBox,
  ComboBoxItem,
  Dialog,
  DialogFooter,
  DialogTrigger,
  Form,
  type Key,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Slider,
  Surface,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
} from '@plurid/carved-ui-react';

/** Fixtures for the Playwright browser suite in tools/tests. Hidden from the docs. */
const meta = {
  title: 'Testing/Browser',
  tags: ['!autodocs', '!dev'],
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Controls() {
  const [submitted, setSubmitted] = useState('');
  const [workspace, setWorkspace] = useState<Key | null>(null);
  return (
    <div className="lab-stack lab-narrow">
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('email')));
        }}
        onReset={() => setSubmitted('')}
      >
        <TextField
          label="Email"
          name="email"
          type="email"
          defaultValue="team@example.com"
          isRequired
          description="Used for receipts."
        />
        <Checkbox name="updates" defaultSelected>
          Project updates
        </Checkbox>
        <RadioGroup label="Visibility" name="visibility" defaultValue="private">
          <Radio value="private">Private</Radio>
          <Radio value="team">Team</Radio>
        </RadioGroup>
        <Switch name="notifications">Notifications</Switch>
        <div className="lab-row">
          <Button type="submit">Save</Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
          <Button isDisabled variant="ghost">
            Unavailable
          </Button>
        </div>
      </Form>
      <output aria-label="Submitted email">{submitted}</output>
      <Select label="Workspace" placeholder="Choose" value={workspace} onChange={setWorkspace}>
        <SelectItem id="design">Design</SelectItem>
        <SelectItem id="engineering">Engineering</SelectItem>
      </Select>
      <output aria-label="Selected workspace">{workspace}</output>
      <ComboBox label="Jump to">
        <ComboBoxItem id="docs">Documentation</ComboBoxItem>
        <ComboBoxItem id="deploys">Deploys</ComboBoxItem>
      </ComboBox>
      <Slider label="Volume" defaultValue={40} />
      <Tabs>
        <TabList aria-label="Project">
          <Tab id="overview">Overview</Tab>
          <Tab id="activity">Activity</Tab>
        </TabList>
        <TabPanel id="overview">Overview panel</TabPanel>
        <TabPanel id="activity">Activity panel</TabPanel>
      </Tabs>
    </div>
  );
}

export const ControlsHarness: Story = { render: () => <Controls /> };

/** Overlays opened from nested providers, scrolling containers and right-to-left locales. */
export const PortalsHarness: Story = {
  render: () => {
    const [accent, setAccent] = useState('#fde68a');
    return (
      <div className="lab-stack">
        <DialogTrigger>
          <Button>Rename project</Button>
          <Modal>
            <Dialog title="Rename project" description="The new name appears everywhere at once.">
              {({ close }) => (
                <>
                  <TextField label="Name" defaultValue="Quarry" autoFocus />
                  <DialogFooter>
                    <Button variant="ghost" onPress={close}>
                      Cancel
                    </Button>
                    <Button onPress={close}>Rename</Button>
                  </DialogFooter>
                </>
              )}
            </Dialog>
          </Modal>
        </DialogTrigger>
        <CarvedProvider theme="furor" style={{ '--carved-accent': accent }}>
          <Surface
            className="lab-pad"
            style={{ maxBlockSize: '6rem', overflow: 'auto', position: 'relative' }}
          >
            <MenuTrigger>
              <Button>Nested menu</Button>
              <Menu aria-label="Nested menu">
                <MenuItem id="one">First action</MenuItem>
                <MenuItem id="two">Second action</MenuItem>
              </Menu>
            </MenuTrigger>
            <Button variant="secondary" onPress={() => setAccent('#a5f3fc')}>
              Change accent
            </Button>
          </Surface>
        </CarvedProvider>
        <CarvedProvider theme="light" locale="ar-EG">
          <Tabs>
            <TabList aria-label="Arabic tabs">
              <Tab id="one">الأول</Tab>
              <Tab id="two">الثاني</Tab>
            </TabList>
            <TabPanel id="one">١</TabPanel>
            <TabPanel id="two">٢</TabPanel>
          </Tabs>
        </CarvedProvider>
      </div>
    );
  },
};
