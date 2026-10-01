// @source ../../../../../docs/examples/confirm-action.tsx
import { ConfirmAction } from '../../../../../docs/examples/confirm-action';

// Fails every other time, to show the error state.
let attempts = 0;
const remove = () =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => (++attempts % 2 ? reject(new Error('Forbidden')) : resolve()), 900),
  );

export default function Example() {
  return <ConfirmAction remove={remove} />;
}
