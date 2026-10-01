import { ComboBox, ComboBoxItem } from '@plurid/carved-ui-react';

const people = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Margaret Hamilton',
  'Katherine Johnson',
].map((name) => ({ id: name, name }));

export default function Example() {
  return (
    <ComboBox label="Assign to" placeholder="Type a name" defaultItems={people} className="narrow">
      {(person) => <ComboBoxItem>{person.name}</ComboBoxItem>}
    </ComboBox>
  );
}
