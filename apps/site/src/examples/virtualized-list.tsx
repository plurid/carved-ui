import {
  Autocomplete,
  ListBox,
  ListBoxItem,
  SearchField,
  Surface,
  Virtualizer,
} from '@plurid/carved-ui-react';

const given = [
  'Amara',
  'Kenji',
  'Lena',
  'Mateo',
  'Priya',
  'Sofia',
  'Émile',
  'Wei',
  'Nadia',
  'Lars',
];
const family = [
  'Okafor',
  'Sato',
  'Fischer',
  'García',
  'Nair',
  'Rossi',
  'Dubois',
  'Zhang',
  'Haddad',
];

// Five thousand people, the same on every render.
const people = Array.from({ length: 5_000 }, (_, index) => ({
  id: index,
  name: `${given[index % given.length]} ${family[(index * 7) % family.length]} ${index + 1}`,
}));

export default function Example() {
  return (
    <Surface className="pad stack narrow">
      {/* A list this long scrolls, so it takes focus itself: type, then Tab into it. */}
      <Autocomplete disableVirtualFocus>
        <SearchField label="Find someone" placeholder="Name or number" />
        <Virtualizer>
          <ListBox
            aria-label="People"
            items={people}
            selectionMode="single"
            renderEmptyState={() => 'Nobody by that name.'}
            style={{ blockSize: '16rem' }}
          >
            {(person) => <ListBoxItem>{person.name}</ListBoxItem>}
          </ListBox>
        </Virtualizer>
      </Autocomplete>
    </Surface>
  );
}
