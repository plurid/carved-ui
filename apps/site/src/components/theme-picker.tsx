import { presetNames } from '@plurid/carved-ui-core';
import type { ThemePreset } from '@plurid/carved-ui-core';
import { ToggleButton, ToggleButtonGroup, Tooltip, TooltipTrigger } from '@plurid/carved-ui-react';
import { setSiteTheme, useSiteTheme } from '../theme';

/** Seven sockets, each inlaid with a preset's material and accent. */
export function ThemePicker() {
  const theme = useSiteTheme();
  return (
    <ToggleButtonGroup
      aria-label="Site theme"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[theme]}
      onSelectionChange={(keys) => setSiteTheme([...keys][0] as ThemePreset)}
      className="theme-picker"
    >
      {presetNames.map((name) => (
        <TooltipTrigger key={name} delay={400}>
          <ToggleButton id={name} aria-label={name} size="sm" className="theme-socket">
            <span className="theme-swatch" data-carved-theme={name} aria-hidden="true" />
          </ToggleButton>
          <Tooltip>{name}</Tooltip>
        </TooltipTrigger>
      ))}
    </ToggleButtonGroup>
  );
}
