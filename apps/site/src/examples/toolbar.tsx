import { Button, Separator, ToggleButton, Toolbar } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Toolbar aria-label="Text formatting">
      <ToggleButton size="sm" aria-label="Bold">
        <b>B</b>
      </ToggleButton>
      <ToggleButton size="sm" aria-label="Italic">
        <i>I</i>
      </ToggleButton>
      <ToggleButton size="sm" aria-label="Underline">
        <u>U</u>
      </ToggleButton>
      <Separator orientation="vertical" />
      <Button size="sm" variant="ghost">
        Link
      </Button>
      <Button size="sm" variant="ghost">
        Quote
      </Button>
    </Toolbar>
  );
}
