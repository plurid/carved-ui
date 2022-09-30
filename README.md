# Carved UI

A React component library with recessed surfaces, semantic themes, and accessible interaction.

This is the **v1 preview**: a deliberate breaking redesign of the original library. React is the active implementation. The old HTML, Vue, and design applications are archived in [`legacy/`](legacy/README.md).

## Use

Requires React 19 and an ESM-capable build tool. These preview packages are prepared in this checkout; the installation command applies after their first publication.

```sh
pnpm add @plurid/carved-ui-react@next @plurid/carved-ui-core@next
```

```tsx
import { CarvedProvider, Button } from '@plurid/carved-ui-react';
import '@plurid/carved-ui-react/styles.css';

export function App() {
  return (
    <CarvedProvider theme="ponton">
      <Button onPress={() => console.log('Save')}>Save changes</Button>
    </CarvedProvider>
  );
}
```

Use `night`, `dusk`, `dawn`, `light`, `ponton`, `jaune`, or `furor`, or generate a custom theme with `createTheme({ color: '#284c42' })` from the core package. Components work with the default CSS theme without a provider; use a provider for scoped themes and locale.

## Develop

Use Node **24 LTS** and pnpm **11.3.0** (the version in `packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm dev
```

Open [localhost:6006](http://localhost:6006) for the component laboratory. Theme and direction controls apply to every story. Package source edits reload immediately; token edits regenerate the theme CSS.

```sh
pnpm check           # builds, lint, types, behavior, accessibility, packages, browsers
pnpm build           # ESM packages and static Storybook
pnpm test:stories    # executable stories in Chromium
pnpm test:visual     # browser regressions against the built Storybook
```

`pnpm verify:packages` installs packed tarballs into temporary Vite and Next.js consumers, checks declarations and exports, and tests production rendering and hydration. Browser tests need permission to start local servers. Visual baselines use macOS; see [verification](docs/verification.md).

## Repository

| Directory        | Responsibility                                                     |
| ---------------- | ------------------------------------------------------------------ |
| `packages/core`  | DTCG tokens, pure theme generation, generated theme CSS            |
| `packages/react` | React Aria controls, native content components, scoped CSS         |
| `apps/storybook` | Component states, executable stories, and examples                 |
| `tools`          | Shared configuration, builds, consumer fixtures, and browser tests |
| `docs`           | Architecture, migration, accessibility, and editable recipes       |
| `legacy`         | Preserved inactive implementations, outside the workspace          |

The root retains six required files. Build and test configuration lives with its owner or under `tools/config`.

Read the [architecture](docs/architecture.md), [component catalog](docs/catalog.md), [migration guide](docs/migration.md), and [contributing and release guide](docs/contributing.md). Complex patterns in [`docs/examples`](docs/examples/README.md) are application-owned source; a registry can be introduced when there is enough demand to justify it.

MIT licensed.
