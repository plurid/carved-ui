/**
 * The single source of Carved's design tokens.
 *
 * Foundation tokens are written in the Design Tokens Community Group format, so they can be
 * exported verbatim to `tokens.json`. Colours are not foundation tokens: every colour is
 * generated from a theme's base colour by `createTheme`.
 */

type Dimension = { $type: 'dimension'; $value: { value: number; unit: 'px' | 'rem' } };
type Duration = { $type: 'duration'; $value: { value: number; unit: 'ms' } };
type FontFamily = { $type: 'fontFamily'; $value: string[] };
type CubicBezier = { $type: 'cubicBezier'; $value: [number, number, number, number] };
type NumberToken = { $type: 'number'; $value: number };
export type FoundationToken = Dimension | Duration | FontFamily | CubicBezier | NumberToken;

const rem = (value: number): Dimension => ({ $type: 'dimension', $value: { value, unit: 'rem' } });
const px = (value: number): Dimension => ({ $type: 'dimension', $value: { value, unit: 'px' } });

export const foundation = {
  space: {
    '0': rem(0),
    '1': rem(0.25),
    '2': rem(0.5),
    '3': rem(0.75),
    '4': rem(1),
    '5': rem(1.5),
    '6': rem(2),
    '7': rem(3),
    '8': rem(4),
  },
  radius: {
    surface: px(6),
    control: px(10),
    pill: px(999),
  },
  font: {
    body: {
      $type: 'fontFamily',
      $value: [
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
    },
    display: {
      $type: 'fontFamily',
      $value: ['Helvetica Neue', 'Arial', 'system-ui', 'sans-serif'],
    },
    mono: {
      $type: 'fontFamily',
      $value: ['ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
    },
  },
  text: {
    xs: rem(0.75),
    sm: rem(0.875),
    md: rem(1),
    lg: rem(1.125),
    xl: rem(1.375),
  },
  motion: {
    duration: { $type: 'duration', $value: { value: 160, unit: 'ms' } },
    easing: { $type: 'cubicBezier', $value: [0.2, 0.7, 0.2, 1] },
  },
  z: {
    overlay: { $type: 'number', $value: 1000 },
  },
} as const satisfies Record<string, Record<string, FoundationToken>>;

/** Tone seeds: the hue and character of each inlay before contrast solving. */
export interface ToneSeeds {
  accent: string;
  success: string;
  warning: string;
  danger: string;
}

/** The original button kinds: accept, warning and hazard, plus a success green. */
export const standardTones: ToneSeeds = {
  accent: 'hsl(220 60% 40%)',
  success: 'hsl(150 55% 35%)',
  warning: 'hsl(45 90% 50%)',
  danger: 'hsl(355 60% 40%)',
};

export const themeDefaults = {
  depthDifference: 0.06,
  shadowAngle: 90,
  shadowDistance: 5,
} as const;

export type Tone = keyof ToneSeeds;
export const tones = Object.freeze(['accent', 'success', 'warning', 'danger'] as const);

/**
 * The seven original themes. Bases are the 2019 HSL values; accents are curated so each
 * inlay reads as part of its material.
 */
export const presetOptions = {
  night: { color: 'hsl(210 0% 10%)', tones: { accent: 'hsl(215 80% 62%)' } },
  dusk: { color: 'hsl(210 0% 20%)', tones: { accent: 'hsl(215 80% 62%)' } },
  dawn: { color: 'hsl(210 0% 70%)', tones: { accent: 'hsl(220 60% 30%)' } },
  light: { color: 'hsl(210 0% 100%)', tones: { accent: 'hsl(220 60% 40%)' } },
  ponton: { color: 'hsl(210 25% 30%)', tones: { accent: 'hsl(188 45% 66%)' } },
  jaune: { color: 'hsl(35 90% 45%)', tones: { accent: 'hsl(225 70% 22%)' } },
  furor: { color: 'hsl(360 90% 30%)', tones: { accent: 'hsl(40 85% 72%)' } },
} as const satisfies Record<string, { color: string; tones?: Partial<ToneSeeds> }>;

export type ThemePreset = keyof typeof presetOptions;
/** The preset themes' options, ready for `createTheme`. Import them without the colour engine. */
export const presets: Readonly<Record<ThemePreset, { color: string; tones?: Partial<ToneSeeds> }>> =
  Object.freeze(presetOptions);
export const presetNames = Object.freeze(Object.keys(presetOptions) as ThemePreset[]);
