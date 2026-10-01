// @source ../../../../../docs/examples/settings-form.tsx
import { SettingsForm } from '../../../../../docs/examples/settings-form';

const save = () => new Promise<void>((resolve) => setTimeout(resolve, 900));

export default function Example() {
  return <SettingsForm save={save} />;
}
