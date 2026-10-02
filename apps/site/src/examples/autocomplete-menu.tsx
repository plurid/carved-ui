import { useState } from 'react';
import {
  Autocomplete,
  Button,
  MenuItem,
  MenuList,
  MenuTrigger,
  Popover,
  SearchField,
} from '@plurid/carved-ui-react';
import type { Selection } from '@plurid/carved-ui-react';

const labels = ['Bug', 'Design', 'Documentation', 'Good first issue', 'Performance', 'Security'];

export default function Example() {
  const [chosen, setChosen] = useState<Selection>(new Set(['Design']));
  const count = chosen === 'all' ? labels.length : chosen.size;
  return (
    <MenuTrigger>
      <Button variant="secondary">Labels{count > 0 && ` · ${count}`}</Button>
      <Popover placement="bottom start">
        <Autocomplete>
          <SearchField aria-label="Filter labels" placeholder="Filter labels" autoFocus />
          <MenuList
            aria-label="Labels"
            selectionMode="multiple"
            selectedKeys={chosen}
            onSelectionChange={setChosen}
            renderEmptyState={() => <p className="muted">No such label.</p>}
          >
            {labels.map((label) => (
              <MenuItem key={label} id={label}>
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </Autocomplete>
      </Popover>
    </MenuTrigger>
  );
}
