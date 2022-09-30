'use client';
import { useState } from 'react';
import {
  Form,
  TextField,
  Label,
  Input,
  FieldDescription,
  FieldError,
  Switch,
  Button,
  Alert,
  Spinner,
} from '@plurid/carved-ui-react';

/** Application-owned: replace save with your API call and domain validation. */
export function SettingsForm({
  save,
}: {
  save: (values: { name: string; notifications: boolean }) => Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  return (
    <Form
      className="lab-stack lab-field"
      onSubmit={async (event) => {
        event.preventDefault();
        if (pending) return;
        const values = new FormData(event.currentTarget);
        setPending(true);
        setMessage('');
        setError('');
        try {
          await save({
            name: String(values.get('name')),
            notifications: values.has('notifications'),
          });
          setMessage('Settings saved.');
        } catch {
          setError('Settings could not be saved. Try again.');
        } finally {
          setPending(false);
        }
      }}
    >
      <TextField name="name" isRequired isDisabled={pending} defaultValue="Carved UI">
        <Label>Project name</Label>
        <Input />
        <FieldDescription>Use a name your team will recognize.</FieldDescription>
        <FieldError />
      </TextField>
      <Switch name="notifications" defaultSelected isDisabled={pending}>
        Email notifications
      </Switch>
      <Button type="submit" isPending={pending}>
        {pending && <Spinner aria-label="Saving" />}Save settings
      </Button>
      {message && <p role="status">{message}</p>}
      {error && <Alert tone="danger">{error}</Alert>}
    </Form>
  );
}
