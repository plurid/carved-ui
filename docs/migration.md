# Migrate to v1

Version 1 is a breaking redesign. The React package remains `@plurid/carved-ui-react`; shared tokens and theme generation move to `@plurid/carved-ui-core`. Use React 19, an ESM build, and import `@plurid/carved-ui-react/styles.css` once. Existing applications should migrate on a branch rather than updating the dependency without changing call sites.

| Original pattern                           | v1 replacement                                                    |
| ------------------------------------------ | ----------------------------------------------------------------- |
| CarvedButton / CarvedClick (clickable div) | `Button onPress` or `Link href` with native semantics             |
| CarvedInput with internal label props      | `TextField` + `Label` + `Input` + description/error parts         |
| CarvedSelect                               | `Select` + `Label` + `Button`/`SelectValue` + `Popover`/`ListBox` |
| CarvedToggle                               | `Switch` with `isSelected` / `defaultSelected`                    |
| CarvedCheck / radio controls               | `Checkbox` / `RadioGroup` + `Radio`                               |
| CarvedSlider                               | `Slider` + `Label` + `SliderOutput` + track/thumbs                |
| CarvedMenu                                 | `MenuTrigger` + `Button` + `Popover` + `Menu`/`MenuItem`          |
| Layers/strata/plates/tiles and aliases     | `Surface` or `Card`; context determines nested depth              |
| CarvedH1–H6                                | `Heading level={1..6}` or native headings                         |
| Component constructor theme props          | `CarvedProvider theme={presetOrTheme}`; semantic CSS variables    |
| Runtime theme injected into document       | Pure `createTheme` map applied to a scoped provider               |
| Lerna/Rollup/CRA scripts                   | Root pnpm commands and Storybook/Vite                             |

Theme presets preserve the names, with updated OKLCH ramps and contrast-aware semantic variables. `createTheme` accepts `{ color, depthDifference?, shadowAngle?, shadowDistance? }`, validates tuning ranges and opaque colors, and returns immutable variables. No geological aliases, display-name coupling or legacy compatibility wrappers are retained.

```tsx
import {
  CarvedProvider,
  TextField,
  Label,
  Input,
  FieldDescription,
  Button,
} from '@plurid/carved-ui-react';
import { createTheme } from '@plurid/carved-ui-core';
import '@plurid/carved-ui-react/styles.css';

const theme = createTheme({ color: '#284c42' });

<CarvedProvider theme={theme}>
  <TextField name="project" defaultValue="Carved UI">
    <Label>Project name</Label>
    <Input />
    <FieldDescription>Shown to your team.</FieldDescription>
  </TextField>
  <Button variant="primary" onPress={() => {}}>
    Save changes
  </Button>
</CarvedProvider>;
```

Put field values and defaults on `TextField`, not its inner Input. Stateful React Aria controls use `isDisabled`, `isRequired`, `isReadOnly`, `selectedKey`, `isSelected` and their corresponding default/change props. Native static elements retain HTML attributes. Use React 19 `ref` props directly.

In Next.js, import CSS in the root layout. Components with interaction belong in a client module, while `Heading`, table parts and other static exports can render from a server component. Theme generation can run on the server and pass its serializable result to a provider.

The old HTML, Vue and CRA design app live under `legacy/` for reference only. Their manifests are excluded from the workspace and CI; they have no active release or support promise. The original React implementation remains available in Git history.
