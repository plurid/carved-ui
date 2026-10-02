import { Autocomplete, ListBox, ListBoxItem, SearchField, Surface } from '@plurid/carved-ui-react';

const people = [
  'Amara Okafor',
  'Kenji Sato',
  'Lena Fischer',
  'Mateo García',
  'Priya Nair',
  'Sofia Rossi',
  'Émile Dubois',
  'Zhang Wei',
  'Nadia Haddad',
  'Lars Eriksen',
].map((name) => ({ id: name, name }));

export default function Example() {
  return (
    <Surface className="pad stack narrow">
      <Autocomplete>
        <SearchField label="Invite" placeholder="Search people" />
        <ListBox
          aria-label="People"
          items={people}
          selectionMode="multiple"
          renderEmptyState={() => 'Nobody by that name.'}
        >
          {(person) => <ListBoxItem>{person.name}</ListBoxItem>}
        </ListBox>
      </Autocomplete>
    </Surface>
  );
}
