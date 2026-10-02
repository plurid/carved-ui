import { presetNames } from '@plurid/carved-ui-core';
import type { ThemePreset } from '@plurid/carved-ui-core';
import { IconButton, Menu, MenuItem, MenuTrigger } from '@plurid/carved-ui-react';

export interface ThemeMenuProps {
  theme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
}

/** Switches the material the app is cut into. */
export function ThemeMenu({ theme, onThemeChange }: ThemeMenuProps) {
  return (
    <MenuTrigger>
      <IconButton aria-label="Material">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
        </svg>
      </IconButton>
      <Menu
        aria-label="Material"
        placement="bottom end"
        selectionMode="single"
        selectedKeys={[theme]}
        onSelectionChange={(keys) => {
          const [next] = keys === 'all' ? [] : [...keys];
          if (next) onThemeChange(next as ThemePreset);
        }}
      >
        {presetNames.map((name) => (
          <MenuItem key={name} id={name}>
            {name}
          </MenuItem>
        ))}
      </Menu>
    </MenuTrigger>
  );
}
