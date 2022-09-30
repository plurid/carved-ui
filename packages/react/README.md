# @plurid/carved-ui-react

React 19 components in the Carved surface language. Native HTML and React Aria provide semantics, keyboard navigation, and focus management.

```tsx
import {
  CarvedProvider,
  Button,
  TextField,
  Label,
  Input,
  FieldDescription,
} from '@plurid/carved-ui-react';
import '@plurid/carved-ui-react/styles.css';

<CarvedProvider theme="ponton" locale="en-US">
  <TextField name="email" type="email" isRequired>
    <Label>Email</Label>
    <Input />
    <FieldDescription>Used for project notifications.</FieldDescription>
  </TextField>
  <Button onPress={() => {}}>Save</Button>
</CarvedProvider>;
```

Import the stylesheet once in the application entry or Next.js root layout. Exports are ESM and include declarations and CSS import types. Interactive modules preserve `use client`; static content components can be used from server components. Refs are ordinary React 19 props.

Root and component subpath imports are supported: `@plurid/carved-ui-react/button`, `/fields`, `/dialog`, `/card`, and others listed in package exports. Components sharing behavior live in cohesive modules; subpaths do not add wrapper files.

Use semantic variants, compositional parts, native attributes and React Aria state props (`isDisabled`, `isSelected`, etc.). `className`, `style`, and render props are escape hatches. Scoped CSS variables form the styling boundary. Provide accessible labels for every field, icon button, overlay, menu, and progress control.

See the repository catalog, migration guide, accessibility checklist, and editable recipes. Toast adapts the pinned React Aria experimental API; evaluate upstream changes before upgrading it. MIT licensed.
