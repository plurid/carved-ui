import { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  type Selection,
} from '@plurid/carved-ui-react';

export default function Example() {
  const [sort, setSort] = useState<Selection>(new Set(['updated']));
  return (
    <MenuTrigger>
      <Button variant="secondary">Sort</Button>
      <Menu
        aria-label="Sort"
        selectionMode="single"
        selectedKeys={sort}
        onSelectionChange={setSort}
      >
        <MenuSection title="Sort by">
          <MenuItem id="name">Name</MenuItem>
          <MenuItem id="updated">Last updated</MenuItem>
          <MenuItem id="size">Size</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  );
}
