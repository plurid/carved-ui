import { Button, Dialog, DialogTrigger, Drawer, RadioGroup, Radio } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <DialogTrigger>
      <Button variant="secondary">Filters</Button>
      <Drawer isDismissable>
        <Dialog title="Filters" description="Narrow the list of projects.">
          <RadioGroup label="Status" defaultValue="all">
            <Radio value="all">All</Radio>
            <Radio value="live">Live</Radio>
            <Radio value="paused">Paused</Radio>
          </RadioGroup>
        </Dialog>
      </Drawer>
    </DialogTrigger>
  );
}
