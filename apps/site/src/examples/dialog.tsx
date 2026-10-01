import {
  Button,
  Dialog,
  DialogFooter,
  DialogTrigger,
  Modal,
  TextField,
} from '@plurid/carved-ui-react';

export default function Example() {
  return (
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
  );
}
