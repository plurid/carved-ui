# Migrating from 0.x

Version 1 is a rewrite. The material is the same idea, carved surfaces darkening with depth, but every component has a new API built on React 19 and React Aria. The package name stays `@plurid/carved-ui-react`; `styled-components` and `styled-theming` are gone.

## Setup

```tsx
// 0.x
import { CarvedApp } from '@plurid/carved-ui-react';

<CarvedApp theme="ponton" depthDifference="0.3">
  …
</CarvedApp>;

// 1.0
import { CarvedProvider } from '@plurid/carved-ui-react';
import '@plurid/carved-ui-react/styles.css';

<CarvedProvider theme="ponton">…</CarvedProvider>;
```

- `CarvedApp` painted `html` and `body`. `CarvedProvider` themes only its own element, so providers can nest.
- Theme options moved to `createTheme` in `@plurid/carved-ui-core`, and they are numbers now: `createTheme({ color, depthDifference: 0.06, shadowAngle: 90, shadowDistance: 5 })`. A color string passed as `theme` becomes `theme={createTheme({ color })}`.
- `depthDifference` is now a step in OKLCH lightness (0–0.12) rather than a ratio, and `lightnessInversionLimit`, `lightnessInversionLow` and `lightnessInversionHigh` are gone: text colour is chosen for contrast automatically.
- `autoDepth` is always on. Depth comes from React context rather than cloning children, so it passes through any wrapper.

## Components

| 0.x                                                                          | 1.0                                                                      |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `CarvedApp`                                                                  | `CarvedProvider`                                                         |
| `CarvedStratum`                                                              | `Surface`, or the `carved-carve` class                                   |
| `CarvedSection` (`CarvedKarst`), `CarvedTile` (`CarvedDoline`), `CarvedCard` | `Surface` or `Card`                                                      |
| `CarvedContainer` (`CarvedPolje`), `CarvedRow` (`CarvedFjord`)               | Your own layout CSS                                                      |
| `CarvedButton`                                                               | `Button`                                                                 |
| `CarvedButton kind="accept"`                                                 | `Button` (the accent inlay)                                              |
| `CarvedButton kind="hazard"`                                                 | `Button variant="danger"`                                                |
| `CarvedButton kind="decline"`                                                | `Button variant="secondary"`                                             |
| `CarvedButton kind="warning"`                                                | `Button`, with the warning stated in an `Alert tone="warning"`           |
| `kind="…Themed"`                                                             | `createTheme({ color, tones: 'themed' })`                                |
| `CarvedInput`                                                                | `TextField`                                                              |
| `CarvedSelector`                                                             | `Select`                                                                 |
| `CarvedHR`                                                                   | `Separator variant="trench"`                                             |
| `CarvedH1` … `CarvedH6`                                                      | `Heading level={1…6}`; `variant="engraved"` for the carved display style |
| `CarvedMenuBar`, `CarvedMenuItems`, `CarvedMenuList`                         | Your own navigation with `Link`, or `Tabs`                               |
| `CarvedMenuItem` with `expand`                                               | `MenuTrigger` and `Menu`                                                 |
| `CarvedMenuItem` with `tooltip`                                              | `TooltipTrigger` and `Tooltip`                                           |
| `CarvedMenuItem decarved`                                                    | No equivalent: only moving pieces rise in 1.0                            |
| `CarvedDots`                                                                 | `IconButton` with your own icon                                          |

## Props

- Event handlers follow React Aria: `onPress` instead of `onClick`, `onChange(value)` with the value instead of the event, `isDisabled` instead of `disabled`.
- `text` props are gone: pass children. `CarvedButton text="Save"` becomes `<Button>Save</Button>`.
- `stratum` (inline styles) becomes `style` or `className`.
- `CarvedInput`'s `label` and `placeholder` keep their names on `TextField`.
- `CarvedSelector`'s `selectors` become `SelectItem` children, `initial` becomes `defaultValue`, and the current value is read with `value` and `onChange`.

## Styling

Styles are plain CSS in cascade layers, driven by `--carved-*` custom properties. Override a token on any element, or write CSS outside a layer, which always wins. There is no CSS-in-JS runtime, so components render on the server.
