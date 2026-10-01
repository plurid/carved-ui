import { Button, ToastQueue, ToastRegion } from '@plurid/carved-ui-react';

// Create one queue for the whole application, and render its region once.
const toasts = new ToastQueue({ maxVisibleToasts: 3 });

export default function Example() {
  return (
    <div className="row">
      <Button
        variant="secondary"
        onPress={() => toasts.add({ title: 'Project saved', tone: 'success' }, { timeout: 5000 })}
      >
        Save
      </Button>
      <Button
        variant="secondary"
        onPress={() =>
          toasts.add({
            title: 'Project archived',
            description: 'It no longer appears in the list.',
            action: {
              label: 'Undo',
              onAction: () => toasts.add({ title: 'Project restored' }, { timeout: 3000 }),
            },
          })
        }
      >
        Archive
      </Button>
      <ToastRegion queue={toasts} />
    </div>
  );
}
