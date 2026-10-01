import {
  Description,
  FieldButton,
  FieldError,
  Input,
  InputGroup,
  Label,
  TextFieldRoot,
} from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <TextFieldRoot defaultValue="https://quarry.example/invite/7c1f" isReadOnly className="narrow">
      <Label>Invite link</Label>
      <InputGroup>
        <Input className="carved-group-input" />
        <FieldButton
          onPress={() => navigator.clipboard?.writeText('https://quarry.example/invite/7c1f')}
        >
          Copy
        </FieldButton>
      </InputGroup>
      <Description>Anyone with the link can join as a viewer.</Description>
      <FieldError />
    </TextFieldRoot>
  );
}
