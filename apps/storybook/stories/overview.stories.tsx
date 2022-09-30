import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CarvedProvider,
  Surface,
  Heading,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  TextField,
  Label,
  Input,
  Switch,
  Progress,
  DialogTrigger,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Separator,
  Link,
} from '@plurid/carved-ui-react';
import { presetNames, createTheme } from '@plurid/carved-ui-core';
const meta = { title: 'Start/Carved', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
function Showcase() {
  const [theme, setTheme] = useState<(typeof presetNames)[number]>('ponton');
  return (
    <CarvedProvider theme={theme}>
      <div className="showcase">
        <header className="showcase-header">
          <div>
            <p className="showcase-kicker">Carved UI · React</p>
            <Heading level={1}>Depth, without the weight.</Heading>
            <p className="showcase-intro">
              Quiet surfaces. Clear controls. A component system built to fit your work.
            </p>
          </div>
          <Badge>Version 1 preview</Badge>
        </header>
        <nav aria-label="Theme presets" className="lab-row">
          {presetNames.map((name) => (
            <Button
              key={name}
              size="sm"
              variant={theme === name ? 'primary' : 'ghost'}
              onPress={() => setTheme(name)}
              aria-pressed={theme === name}
            >
              {name}
            </Button>
          ))}
        </nav>
        <div className="showcase-grid">
          <Card>
            <CardHeader>
              <p className="showcase-kicker">01 / Controls</p>
              <CardTitle>A place for your next idea</CardTitle>
              <CardDescription>Start with native semantics. Compose the details.</CardDescription>
            </CardHeader>
            <CardContent className="lab-stack">
              <TextField defaultValue="Carved UI">
                <Label>Project name</Label>
                <Input />
              </TextField>
              <Switch defaultSelected>Share with your team</Switch>
            </CardContent>
            <CardFooter>
              <DialogTrigger>
                <Button>Create project</Button>
                <DialogContent isDismissable>
                  <Dialog>
                    <DialogTitle>Create your project</DialogTitle>
                    <DialogDescription>
                      Your workspace is ready for a new project.
                    </DialogDescription>
                    <DialogFooter>
                      <Button slot="close" variant="secondary">
                        Cancel
                      </Button>
                      <Button slot="close">Create</Button>
                    </DialogFooter>
                  </Dialog>
                </DialogContent>
              </DialogTrigger>
              <Link variant="secondary" href="./?path=/docs/actions-button--docs">
                Explore components
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <p className="showcase-kicker">02 / Surfaces</p>
              <CardTitle>Six levels, one language</CardTitle>
              <CardDescription>
                Depth follows composition and settles at the sixth surface.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Surface depth={1} className="depth-demo">
                Level 1
                <Surface>
                  Level 2
                  <Surface>
                    Level 3
                    <Surface>
                      Level 4<Surface>Level 5</Surface>
                    </Surface>
                  </Surface>
                </Surface>
              </Surface>
            </CardContent>
          </Card>
        </div>
        <Separator />
        <footer className="showcase-footer">
          <div>
            <Heading level={2}>Small foundations. Room to build.</Heading>
            <p>Tokens and controls are packaged. Your patterns stay yours.</p>
            <Link href="./?path=/docs/recipes-editable-patterns--docs">See editable patterns</Link>
          </div>
          <div className="showcase-progress">
            <Progress value={72}>
              <Label>Example upload</Label>
            </Progress>
            <p className="carved-description">72% · Ready when you are.</p>
          </div>
        </footer>
      </div>
    </CarvedProvider>
  );
}
export const ShowcaseControl: Story = {
  render: () => <Showcase />,
  parameters: { layout: 'fullscreen' },
};
export const CustomTheme: Story = {
  render: () => (
    <CarvedProvider theme={createTheme({ color: '#21483e', shadowAngle: 120, shadowDistance: 4 })}>
      <Card className="lab-field">
        <CardHeader>
          <CardTitle>Your own color</CardTitle>
          <CardDescription>Generated foregrounds stay readable at every depth.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>Save changes</Button>
          <Button variant="secondary">Cancel</Button>
        </CardFooter>
      </Card>
    </CarvedProvider>
  ),
};
