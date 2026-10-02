import { useState } from 'react';
import { parseDate } from '@internationalized/date';
import {
  Button,
  ComboBox,
  ComboBoxItem,
  DatePicker,
  Dialog,
  DialogFooter,
  Drawer,
  FileItem,
  FileList,
  FileTrigger,
  Form,
  TextField,
} from '@plurid/carved-ui-react';
import { useUploads } from '../shared/uploads';
import type { Person } from './data';

export interface Draft {
  to: string;
  subject: string;
  body: string;
  /** The day to send it on, or now. */
  later: string | null;
}

interface ComposeProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  contacts: Person[];
  onSend: (draft: Draft) => void;
}

/** The earliest day a message can wait for: tomorrow, by the app's clock. */
const tomorrow = parseDate('2026-03-11');

/** A new message, in a drawer from the end of the window. */
export function Compose({ isOpen, onOpenChange, contacts, onSend }: ComposeProps) {
  const attachments = useUploads();
  const [to, setTo] = useState('');
  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
      <Dialog title="New message" className="post-compose">
        {({ close }) => (
          <Form
            className="post-compose-form"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              onSend({
                to,
                subject: String(form.get('subject') ?? ''),
                body: String(form.get('body') ?? ''),
                later: (form.get('later') as string | null) || null,
              });
              setTo('');
              attachments.clear();
              close();
            }}
          >
            <ComboBox
              label="To"
              items={contacts}
              allowsCustomValue
              isRequired
              inputValue={to}
              onInputChange={setTo}
              placeholder="Name or address"
            >
              {(person) => (
                <ComboBoxItem id={person.email} textValue={person.name}>
                  {person.name}
                </ComboBoxItem>
              )}
            </ComboBox>
            <TextField label="Subject" name="subject" isRequired />
            <TextField label="Message" name="body" multiline rows={7} isRequired />
            <DatePicker
              label="Send later"
              name="later"
              minValue={tomorrow}
              description="Leave empty to send now."
            />
            <div className="post-attach">
              <FileTrigger
                allowsMultiple
                onSelect={(files) => files && attachments.add([...files])}
              >
                <Button variant="secondary" size="sm">
                  Attach files
                </Button>
              </FileTrigger>
              {attachments.uploads.length > 0 && (
                <FileList aria-label="Attachments">
                  {attachments.uploads.map((upload) => (
                    <FileItem
                      key={upload.id}
                      file={upload.file}
                      progress={upload.progress < 100 ? upload.progress : undefined}
                      onRemove={() => attachments.remove(upload.id)}
                    />
                  ))}
                </FileList>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" slot="close">
                Discard
              </Button>
              <Button type="submit" isPending={attachments.busy}>
                {attachments.busy ? 'Attaching…' : 'Send'}
              </Button>
            </DialogFooter>
          </Form>
        )}
      </Dialog>
    </Drawer>
  );
}
