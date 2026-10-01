'use client';
import { AlertDialog, Button, DialogTrigger, Modal } from '@plurid/carved-ui-react';

/**
 * A destructive action behind a confirmation. The dialog stays open and pending while
 * `remove` runs, and announces the error if it fails. Replace `remove` with your API call.
 */
export function ConfirmAction({ remove }: { remove: () => Promise<void> }) {
  return (
    <DialogTrigger>
      <Button variant="danger">Delete project</Button>
      <Modal size="sm">
        <AlertDialog
          title="Delete this project?"
          actionLabel="Delete permanently"
          onAction={remove}
          errorMessage="The project could not be deleted. Try again."
        >
          Its deploys and history are removed from the workspace. This cannot be undone.
        </AlertDialog>
      </Modal>
    </DialogTrigger>
  );
}
