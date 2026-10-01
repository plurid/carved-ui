'use client';
import { useState } from 'react';
import { Alert, Button, Form, Switch, TextField } from '@plurid/carved-ui-react';

export interface Settings {
  name: string;
  notifications: boolean;
}

/** Settings with native validation, a pending save and a retryable error. Replace `save`. */
export function SettingsForm({ save }: { save: (settings: Settings) => Promise<void> }) {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  return (
    <Form
      className="recipe-form"
      onSubmit={async (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setPending(true);
        setStatus('');
        setError('');
        try {
          await save({
            name: String(values.get('name')),
            notifications: values.has('notifications'),
          });
          setStatus('Settings saved.');
        } catch {
          setError('Settings could not be saved. Check your connection and try again.');
        } finally {
          setPending(false);
        }
      }}
    >
      <TextField
        name="name"
        label="Project name"
        description="Use a name your team will recognise."
        defaultValue="Quarry"
        isRequired
        isDisabled={pending}
      />
      <Switch name="notifications" defaultSelected isDisabled={pending}>
        Email notifications
      </Switch>
      {error && (
        <Alert tone="danger" live="assertive" title="Not saved">
          {error}
        </Alert>
      )}
      <div className="recipe-actions">
        <Button type="submit" isPending={pending}>
          Save settings
        </Button>
        {/* Mounted before it changes, so screen readers announce each new status. */}
        <p role="status" className="recipe-status">
          {status}
        </p>
      </div>
    </Form>
  );
}
