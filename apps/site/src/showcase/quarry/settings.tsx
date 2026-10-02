import { useState } from 'react';
import {
  AlertDialog,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DialogTrigger,
  Form,
  Heading,
  Modal,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Slider,
  Switch,
  TextField,
} from '@plurid/carved-ui-react';
import { regions } from './data';

interface SettingsProps {
  project: string;
  onSaved: () => void;
  onDeleted: () => void;
}

const wait = (milliseconds: number) => new Promise((done) => setTimeout(done, milliseconds));

/** The project's settings: a form that saves as a whole, and a place to delete the project. */
export function Settings({ project, onSaved, onDeleted }: SettingsProps) {
  const [saving, setSaving] = useState(false);
  return (
    <div className="quarry-page quarry-settings">
      <header className="quarry-page-head">
        <Heading level={1}>Settings</Heading>
      </header>
      <Form
        className="quarry-settings-form"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          await wait(700);
          setSaving(false);
          onSaved();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle level={2}>General</CardTitle>
          </CardHeader>
          <CardContent>
            <TextField
              key={project}
              label="Project name"
              name="name"
              defaultValue={project}
              isRequired
            />
            <TextField
              label="Domain"
              name="domain"
              defaultValue={`${project.toLowerCase()}.quarry.example`}
              description="Visitors reach the live deploy here."
            />
            <Select label="Primary region" name="region" defaultValue="fra">
              {regions.map((region) => (
                <SelectItem key={region.id} id={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle level={2}>Builds</CardTitle>
            <CardDescription>How pushes become deploys, and how they scale.</CardDescription>
          </CardHeader>
          <CardContent>
            <Switch name="auto" defaultSelected>
              Deploy every push to main
            </Switch>
            <Switch name="previews" defaultSelected>
              Build a preview of every branch
            </Switch>
            <NumberField
              label="Build machines"
              name="machines"
              defaultValue={2}
              minValue={1}
              maxValue={8}
            />
            <Slider
              label="Instances"
              defaultValue={[2, 8]}
              minValue={1}
              maxValue={20}
              thumbLabels={['Fewest', 'Most']}
            />
            <RadioGroup label="Plan" name="plan" defaultValue="team">
              <Radio value="hobby" description="One member, 1,000 build minutes.">
                Hobby
              </Radio>
              <Radio value="team" description="Up to twenty members, 6,000 build minutes.">
                Team
              </Radio>
              <Radio value="business" description="Single sign-on and a support agreement.">
                Business
              </Radio>
            </RadioGroup>
          </CardContent>
        </Card>
        <div className="quarry-save">
          <Button type="submit" isPending={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </Form>
      <Card className="quarry-danger">
        <CardHeader>
          <CardTitle level={2}>Delete project</CardTitle>
          <CardDescription>
            Removes {project}, its deploys and its domains. It cannot be undone.
          </CardDescription>
        </CardHeader>
        <div>
          <DialogTrigger>
            <Button variant="danger">Delete {project}</Button>
            <Modal size="sm">
              <AlertDialog
                title={`Delete ${project}?`}
                actionLabel="Delete project"
                onAction={async () => {
                  await wait(900);
                  onDeleted();
                }}
              >
                Its deploys, domains and settings are removed for good.
              </AlertDialog>
            </Modal>
          </DialogTrigger>
        </div>
      </Card>
    </div>
  );
}
