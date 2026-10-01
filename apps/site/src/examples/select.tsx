import { Select, SelectItem } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Select label="Workspace" placeholder="Choose a workspace" className="narrow">
      <SelectItem id="design">Design</SelectItem>
      <SelectItem id="engineering">Engineering</SelectItem>
      <SelectItem id="research">Research</SelectItem>
    </Select>
  );
}
