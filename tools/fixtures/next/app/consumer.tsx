'use client';
import { useState } from 'react';
import type { Theme } from '@plurid/carved-ui-core';
import {
  Button,
  CarvedProvider,
  Dialog,
  DialogTrigger,
  Modal,
  Select,
  SelectItem,
} from '@plurid/carved-ui-react';

export function Consumer({ theme }: { theme: Theme }) {
  const [count, setCount] = useState(0);
  return (
    <CarvedProvider theme={theme}>
      <Button onPress={() => setCount((value) => value + 1)}>Count {count}</Button>
      <Select label="Plan" placeholder="Choose a plan">
        <SelectItem id="free">Free</SelectItem>
        <SelectItem id="team">Team</SelectItem>
      </Select>
      <DialogTrigger>
        <Button>Open dialog</Button>
        <Modal isDismissable>
          <Dialog title="Consumer dialog">
            <Button slot="close">Close</Button>
          </Dialog>
        </Modal>
      </DialogTrigger>
    </CarvedProvider>
  );
}
