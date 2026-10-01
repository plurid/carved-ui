import { AlertDialog, Button, DialogTrigger, Modal } from '@plurid/carved-ui-react';

const remove = () => new Promise<void>((resolve) => setTimeout(resolve, 1000));

export default function Example() {
  return (
    <DialogTrigger>
      <Button variant="danger">Delete project</Button>
      <Modal size="sm">
        <AlertDialog title="Delete Quarry?" actionLabel="Delete project" onAction={remove}>
          Its deploys and history are removed. This cannot be undone.
        </AlertDialog>
      </Modal>
    </DialogTrigger>
  );
}
