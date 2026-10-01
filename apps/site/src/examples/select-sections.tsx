import { Select, SelectItem, SelectSection } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Select
      label="Region"
      placeholder="Choose a region"
      description="Your data stays in this region."
      className="narrow"
    >
      <SelectSection title="Europe">
        <SelectItem id="fra">Frankfurt</SelectItem>
        <SelectItem id="ams">Amsterdam</SelectItem>
      </SelectSection>
      <SelectSection title="Americas">
        <SelectItem id="iad">Virginia</SelectItem>
        <SelectItem id="gru">São Paulo</SelectItem>
      </SelectSection>
    </Select>
  );
}
