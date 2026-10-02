import { useState } from 'react';
import { Avatar, Badge, Button, GridList, GridListItem } from '@plurid/carved-ui-react';

const team = [
  { id: 'amara', name: 'Amara Okafor', role: 'Owner' },
  { id: 'kenji', name: 'Kenji Sato', role: 'Editor' },
  { id: 'lena', name: 'Lena Fischer', role: 'Viewer' },
];

export default function Example() {
  const [people, setPeople] = useState(team);
  return (
    <GridList
      aria-label="Members"
      items={people}
      selectionMode="multiple"
      defaultSelectedKeys={['kenji']}
      renderEmptyState={() => 'Nobody left on the project.'}
      className="roomy"
    >
      {(person) => (
        <GridListItem textValue={person.name}>
          <Avatar name={person.name} size="sm" />
          <span style={{ flex: 1 }}>{person.name}</span>
          <Badge>{person.role}</Badge>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Remove ${person.name}`}
            onPress={() => setPeople((all) => all.filter((other) => other.id !== person.id))}
          >
            Remove
          </Button>
        </GridListItem>
      )}
    </GridList>
  );
}
