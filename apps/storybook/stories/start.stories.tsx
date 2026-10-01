import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { presetNames } from '@plurid/carved-ui-core';
import type { ThemePreset } from '@plurid/carved-ui-core';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CarvedProvider,
  Checkbox,
  Heading,
  type Key,
  ProgressBar,
  Select,
  SelectItem,
  Separator,
  Slider,
  Surface,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@plurid/carved-ui-react';

const meta = { title: 'Start/Showcase' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Showcase() {
  const [theme, setTheme] = useState<ThemePreset>('ponton');
  return (
    <CarvedProvider theme={theme} className="showcase">
      <header className="showcase-header">
        <div className="showcase-title">
          <p className="lab-caption">Carved UI · React</p>
          <Heading level={1} variant="engraved">
            Carved
          </Heading>
          <p className="showcase-lede">
            Surfaces cut into one material, lit by one light. Accessible React components with six
            levels of depth and themes from a single colour.
          </p>
        </div>
        <ToggleButtonGroup
          aria-label="Theme"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[theme]}
          onSelectionChange={(keys: Set<Key>) => setTheme([...keys][0] as ThemePreset)}
        >
          {presetNames.map((name) => (
            <ToggleButton key={name} id={name} size="sm">
              {name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </header>

      <div className="showcase-grid">
        <Card>
          <CardHeader>
            <CardTitle level={2}>New project</CardTitle>
            <CardDescription>Everything here can be changed later.</CardDescription>
          </CardHeader>
          <CardContent>
            <TextField label="Name" defaultValue="Quarry" />
            <Select label="Workspace" placeholder="Choose a workspace" defaultValue="design">
              <SelectItem id="design">Design</SelectItem>
              <SelectItem id="engineering">Engineering</SelectItem>
              <SelectItem id="research">Research</SelectItem>
            </Select>
            <Switch defaultSelected>Share with the team</Switch>
            <Checkbox description="One message a week, at most.">Email me updates</Checkbox>
          </CardContent>
          <CardFooter>
            <Button>Create project</Button>
            <Button variant="ghost">Cancel</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle level={2}>Six levels, one material</CardTitle>
            <CardDescription>Depth follows composition and stops at five.</CardDescription>
          </CardHeader>
          <Surface className="showcase-depth">
            Level 2
            <Surface className="showcase-depth">
              Level 3
              <Surface className="showcase-depth">
                Level 4<Surface className="showcase-depth">Level 5</Surface>
              </Surface>
            </Surface>
          </Surface>
        </Card>

        <Card>
          <Tabs>
            <TabList aria-label="Project">
              <Tab id="activity">Activity</Tab>
              <Tab id="members">Members</Tab>
              <Tab id="usage">Usage</Tab>
            </TabList>
            <TabPanel id="activity" className="showcase-panel">
              <Alert tone="success" title="Deployed">
                Version 1.4 is live in every region.
              </Alert>
              <Alert tone="warning" title="Quota at 80%">
                Storage will fill in about nine days.
              </Alert>
            </TabPanel>
            <TabPanel id="members" className="showcase-panel">
              {['Ada Lovelace', 'Grace Hopper', 'Alan Turing'].map((name) => (
                <div key={name} className="lab-row">
                  <Avatar name={name} size="sm" />
                  <span>{name}</span>
                  <Badge tone={name === 'Ada Lovelace' ? 'accent' : 'neutral'}>
                    {name === 'Ada Lovelace' ? 'Owner' : 'Editor'}
                  </Badge>
                </div>
              ))}
            </TabPanel>
            <TabPanel id="usage" className="showcase-panel">
              <ProgressBar label="Storage" value={72} />
              <Slider
                label="Monthly budget"
                defaultValue={40}
                formatOptions={{ style: 'currency', currency: 'EUR' }}
                maxValue={200}
              />
            </TabPanel>
          </Tabs>
        </Card>
      </div>
      <Separator variant="trench" />
      <footer className="showcase-footer">
        <Heading level={2}>Small core. Room to build.</Heading>
        <p className="showcase-lede">
          Tokens, theming and controls are packaged. Patterns stay editable in your application.
        </p>
      </footer>
    </CarvedProvider>
  );
}

export const Overview: Story = { render: () => <Showcase /> };
