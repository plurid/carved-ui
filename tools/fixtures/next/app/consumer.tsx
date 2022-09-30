'use client';
import { useState } from 'react';
import type { Theme } from '@plurid/carved-ui-core';
import {
  CarvedProvider,
  Button,
  DialogTrigger,
  DialogContent,
  Dialog,
  DialogTitle,
} from '@plurid/carved-ui-react';
export function Consumer({ theme }: { theme: Theme }) {
  const [count, setCount] = useState(0);
  return (
    <CarvedProvider theme={theme}>
      <Button onPress={() => setCount((value) => value + 1)}>Count {count}</Button>
      <DialogTrigger>
        <Button>Open dialog</Button>
        <DialogContent isDismissable>
          <Dialog>
            <DialogTitle>Consumer dialog</DialogTitle>
            <Button slot="close">Close</Button>
          </Dialog>
        </DialogContent>
      </DialogTrigger>
    </CarvedProvider>
  );
}
