import { ToggleButton, ToggleButtonGroup } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="row">
      <ToggleButton defaultSelected>Pinned</ToggleButton>
      <ToggleButtonGroup
        aria-label="View"
        selectionMode="single"
        defaultSelectedKeys={['grid']}
        disallowEmptySelection
      >
        <ToggleButton id="grid" size="sm">
          Grid
        </ToggleButton>
        <ToggleButton id="list" size="sm">
          List
        </ToggleButton>
        <ToggleButton id="board" size="sm">
          Board
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
