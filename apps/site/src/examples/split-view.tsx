import { useState } from 'react';
import { ListBox, ListBoxItem, SplitPane, SplitView, Surface } from '@plurid/carved-ui-react';
import type { Key } from '@plurid/carved-ui-react';

const notes = [
  { id: 'kickoff', title: 'Kickoff', body: 'Goals for the quarter, and who owns each one.' },
  { id: 'research', title: 'Research', body: 'Twelve interviews, three themes, one surprise.' },
  { id: 'launch', title: 'Launch plan', body: 'The order of the release, and what to watch.' },
];

export default function Example() {
  const [chosen, setChosen] = useState<Key>('research');
  const note = notes.find((item) => item.id === chosen)!;
  return (
    <SplitView defaultSize={35} minSize={20} maxSize={60} style={{ blockSize: '16rem' }}>
      <SplitPane>
        <Surface style={{ blockSize: '100%' }}>
          <ListBox
            aria-label="Notes"
            items={notes}
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[chosen]}
            onSelectionChange={(keys) => keys !== 'all' && setChosen([...keys][0]!)}
          >
            {(item) => <ListBoxItem>{item.title}</ListBoxItem>}
          </ListBox>
        </Surface>
      </SplitPane>
      <SplitPane>
        <Surface className="pad" style={{ blockSize: '100%' }}>
          <strong>{note.title}</strong>
          <p>{note.body}</p>
        </Surface>
      </SplitPane>
    </SplitView>
  );
}
