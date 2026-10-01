<p align="center">
  <img src="docs/assets/carved.png" alt="Carved UI: an engraved wordmark above a form, a stack of nested surfaces and a tabbed panel, all cut into a slate material" width="880" />
</p>

# Carved UI

Accessible React components cut into one material and lit by one light.

Every surface in Carved is a recess, one level darker than the surface around it, down to six levels deep. One light angle places every shadow, so the whole interface agrees. Touch cuts a control deeper; colour is inlaid into the cut. Themes come from a single colour, and a contrast-solving engine keeps every depth readable.

**[Documentation](https://plurid.github.io/carved-ui/)** · **[Theme lab](https://plurid.github.io/carved-ui/themes)** · **[Laboratory](https://plurid.github.io/carved-ui/lab/)**

## Use it

```sh
pnpm add @plurid/carved-ui-react@next
```

```tsx
import { Button, CarvedProvider, TextField } from '@plurid/carved-ui-react';
import '@plurid/carved-ui-react/styles.css';

export function App() {
  return (
    <CarvedProvider theme="ponton">
      <TextField label="Project name" description="Shown to your whole team." />
      <Button onPress={() => console.log('Created')}>Create project</Button>
    </CarvedProvider>
  );
}
```

Pick one of seven materials (`night`, `dusk`, `dawn`, `light`, `ponton`, `jaune`, `furor`) or make your own with `createTheme({ color: '#284c42' })`. Version 1 is a preview and a rewrite: see [migrating from 0.x](docs/migration.md).

## What you get

- **Components for real interfaces**: buttons, fields, checkboxes, radios, switches, sliders, selects, combo boxes, menus, dialogs, drawers, popovers, tooltips, tabs, disclosures, breadcrumbs, alerts, toasts, progress, cards, tables and more. Composed for the common case, with their parts exported for everything else.
- **Accessibility you can rely on**: keyboard, focus and screen reader behaviour from [React Aria](https://react-spectrum.adobe.com/react-aria/), and [contrast guarantees](docs/accessibility.md) on every depth of every theme.
- **Plain CSS**: one stylesheet in cascade layers, driven by `--carved-*` custom properties. No CSS-in-JS runtime, so components render on the server.
- **Small, typed packages**: ESM with TypeScript declarations, tree-shakeable from a single entry point.

## Documentation

- [Getting started](docs/getting-started.md)
- [Accessibility](docs/accessibility.md)
- [Migrating from 0.x](docs/migration.md)
- [Architecture](docs/architecture.md)
- [Recipes](docs/examples/README.md): editable patterns to copy into your app
- [Contributing](docs/contributing.md)

## Repository

| Directory        | What lives there                                                 |
| ---------------- | ---------------------------------------------------------------- |
| `packages/core`  | Tokens, the theme engine and the material: no React              |
| `packages/react` | The components and their stylesheet                              |
| `apps/site`      | The documentation site, built with Carved                        |
| `apps/storybook` | The laboratory: every component in every state, with tests       |
| `docs`           | Guides, and recipes in `docs/examples`                           |
| `tools`          | Build scripts, shared configuration and the browser test suites  |
| `legacy`         | The original HTML, Vue and design implementations, for reference |

MIT licensed.
