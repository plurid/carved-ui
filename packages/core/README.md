# @plurid/carved-ui-core

Framework-independent Carved design tokens and pure, deterministic theme generation. ESM with TypeScript declarations; no browser globals or React dependency.

```ts
import { createTheme, presets, presetNames } from '@plurid/carved-ui-core';
const theme = createTheme({
  color: '#284c42',
  depthDifference: 0.045,
  shadowAngle: 90,
  shadowDistance: 3,
});
// theme.variables is a frozen map of semantic --carved-* CSS properties.
```

`color` must be concrete and opaque. `depthDifference` accepts 0–0.12, `shadowAngle` 0–360, and `shadowDistance` 0–24. Invalid values throw. Zero is preserved. There are six depth levels, clamped at the darkest end of the generated OKLCH ramp. Foregrounds and muted text target at least 4.5:1; control borders target 3:1 against each generated surface.

Presets: `night`, `dusk`, `dawn`, `light`, `ponton`, `jaune`, `furor`.

Import `@plurid/carved-ui-core/styles.css` for foundation variables and preset selectors, or `@plurid/carved-ui-core/tokens.json` for the canonical DTCG-format tokens. The React stylesheet already includes the core stylesheet.

See the repository docs for architecture and contributing. MIT licensed.
