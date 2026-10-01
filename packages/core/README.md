# @plurid/carved-ui-core

The Carved material without React: design tokens, a theme engine that turns one colour into a readable six-depth theme, and the CSS that every Carved component is built from.

```sh
pnpm add @plurid/carved-ui-core@next
```

```ts
import { createTheme, themeToCss } from '@plurid/carved-ui-core';

const forest = createTheme({ color: '#284c42', shadowAngle: 120 });
forest.variables['--carved-surface-0']; // the page
forest.report.contrast.accent; // the lowest contrast of each part of the accent inlay
themeToCss(forest, '.forest'); // the same theme, as one CSS rule
```

- `createTheme({ color, depthDifference, shadowAngle, shadowDistance, tones })` accepts any opaque CSS colour and returns frozen `--carved-*` variables and a contrast report. Text reaches 4.5:1 on every depth, control edges 3:1, and the accent, success and danger inlays 3:1 against every depth.
- `presets` and `presetNames` hold the seven original themes; they can be imported without loading the colour engine.
- `@plurid/carved-ui-core/styles.css` contains the tokens, the presets, the depth rules and the material classes.
- `@plurid/carved-ui-core/tokens.json` contains the tokens and every preset's colours in the Design Tokens Community Group format.

The React components are in [`@plurid/carved-ui-react`](https://www.npmjs.com/package/@plurid/carved-ui-react), whose stylesheet already includes this one. Read more at [plurid.github.io/carved-ui](https://plurid.github.io/carved-ui/). MIT licensed.
