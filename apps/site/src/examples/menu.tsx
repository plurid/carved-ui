import {
  Button,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  SubmenuTrigger,
} from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <MenuTrigger>
      <Button variant="secondary">Project</Button>
      <Menu aria-label="Project" onAction={(action) => console.log(action)}>
        <MenuItem id="rename" shortcut="⌘R">
          Rename
        </MenuItem>
        <MenuItem id="duplicate" shortcut="⌘D">
          Duplicate
        </MenuItem>
        <SubmenuTrigger>
          <MenuItem id="share">Share</MenuItem>
          <Menu aria-label="Share">
            <MenuItem id="link">Copy link</MenuItem>
            <MenuItem id="email">Email</MenuItem>
          </Menu>
        </SubmenuTrigger>
        <MenuSeparator />
        <MenuItem id="delete">Delete</MenuItem>
      </Menu>
    </MenuTrigger>
  );
}
