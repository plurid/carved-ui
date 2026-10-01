# @plurid/carved-ui-react

Accessible React components cut into one material and lit by one light.

```sh
pnpm add @plurid/carved-ui-react@next
```

```tsx
import { Button, CarvedProvider, Select, SelectItem } from '@plurid/carved-ui-react';
import '@plurid/carved-ui-react/styles.css';

export function App() {
  return (
    <CarvedProvider theme="ponton">
      <Select label="Region" placeholder="Choose a region">
        <SelectItem id="fra">Frankfurt</SelectItem>
        <SelectItem id="iad">Virginia</SelectItem>
      </Select>
      <Button onPress={() => console.log('Deployed')}>Deploy</Button>
    </CarvedProvider>
  );
}
```

Requires React 19. Interaction, focus and screen reader behaviour come from React Aria; the stylesheet is plain CSS in cascade layers, so components render on the server and any `--carved-*` token can be overridden.

Guides, live examples and the full API are at [plurid.github.io/carved-ui](https://plurid.github.io/carved-ui/). MIT licensed.
