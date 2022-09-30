'use client';
import { useState } from 'react';
import {
  DialogTrigger,
  DialogContent,
  AlertDialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Alert,
} from '@plurid/carved-ui-react';

/** A confirmation owns its asynchronous work; the library owns focus and dismissal. */
export function ConfirmAction({ remove }: { remove: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  return (
    <DialogTrigger
      isOpen={open}
      onOpenChange={(value) => {
        if (!pending) {
          setOpen(value);
          setError('');
        }
      }}
    >
      <Button variant="danger">Delete project</Button>
      <DialogContent isKeyboardDismissDisabled={pending}>
        <AlertDialog>
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription>This removes the project from your workspace.</DialogDescription>
          {error && <Alert tone="danger">{error}</Alert>}
          <DialogFooter>
            <Button slot="close" autoFocus variant="secondary" isDisabled={pending}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isPending={pending}
              onPress={async () => {
                if (pending) return;
                setPending(true);
                setError('');
                try {
                  await remove();
                  setOpen(false);
                } catch {
                  setError('The project could not be deleted. Try again.');
                } finally {
                  setPending(false);
                }
              }}
            >
              Delete permanently
            </Button>
          </DialogFooter>
        </AlertDialog>
      </DialogContent>
    </DialogTrigger>
  );
}
