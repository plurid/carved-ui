import { Avatar, Badge, Button, GridList, GridListItem } from '@plurid/carved-ui-react';

const people = [
  { id: 'ana', name: 'Ana Pop', role: 'Owner' },
  { id: 'ioan', name: 'Ioan Marin', role: 'Editor' },
  { id: 'mara', name: 'Mara Ilie', role: 'Viewer' },
];

export default function Example() {
  return (
    <GridList
      aria-label="Members"
      items={people}
      selectionMode="multiple"
      defaultSelectedKeys={['ioan']}
      className="narrow"
    >
      {(person) => (
        <GridListItem textValue={person.name}>
          <Avatar name={person.name} size="sm" />
          <span style={{ flex: 1 }}>{person.name}</span>
          <Badge>{person.role}</Badge>
          <Button variant="ghost" size="sm" aria-label={`Remove ${person.name}`}>
            Remove
          </Button>
        </GridListItem>
      )}
    </GridList>
  );
}
