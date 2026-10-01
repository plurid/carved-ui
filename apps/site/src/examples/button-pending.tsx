import { useState } from 'react';
import { Button } from '@plurid/carved-ui-react';

export default function Example() {
  const [saving, setSaving] = useState(false);
  return (
    <Button
      isPending={saving}
      onPress={() => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1500);
      }}
    >
      {saving ? 'Saving' : 'Save changes'}
    </Button>
  );
}
