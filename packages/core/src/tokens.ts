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
    /** For entrances: overlays, panels and toasts arriving. */
    emphasis: { $type: 'duration', $value: { value: 220, unit: 'ms' } },
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

/**
 * Mineral inlays: low-chroma stone and enamel rather than stock primaries. Hue and chroma are
 * the seed's; the theme engine solves each lightness for contrast.
 */
export const standardTones: ToneSeeds = {
  accent: 'oklch(0.55 0.12 260)',
  success: 'oklch(0.62 0.09 165)',
  warning: 'oklch(0.78 0.12 75)',
  danger: 'oklch(0.6 0.13 22)',
};

export const themeDefaults = {
  depthDifference: 0.06,
  shadowAngle: 90,
  shadowDistance: 5,
} as const;

export type Tone = keyof ToneSeeds;
export const tones = Object.freeze(['accent', 'success', 'warning', 'danger'] as const);

/**
 * The seven original themes. Bases are the 2019 HSL values; each accent is a mineral chosen
 * for its material: silver on the neutral night and dusk, lapis on dawn and light, glacier on
 * ponton, indigo on jaune and gold leaf on furor.
 */
export const presetOptions = {
  night: { color: 'hsl(210 0% 10%)', tones: { accent: 'oklch(0.84 0.025 240)' } },
  dusk: { color: 'hsl(210 0% 20%)', tones: { accent: 'oklch(0.84 0.025 240)' } },
  dawn: { color: 'hsl(210 0% 70%)', tones: { accent: 'oklch(0.4 0.12 265)' } },
  light: { color: 'hsl(210 0% 100%)', tones: { accent: 'oklch(0.45 0.13 258)' } },
  ponton: { color: 'hsl(210 25% 30%)', tones: { accent: 'oklch(0.8 0.07 205)' } },
  jaune: { color: 'hsl(35 90% 45%)', tones: { accent: 'oklch(0.35 0.11 275)' } },
  furor: { color: 'hsl(360 90% 30%)', tones: { accent: 'oklch(0.85 0.1 85)' } },
} as const satisfies Record<string, { color: string; tones?: Partial<ToneSeeds> }>;

export type ThemePreset = keyof typeof presetOptions;
/** The preset themes' options, ready for `createTheme`. Import them without the colour engine. */
export const presets: Readonly<Record<ThemePreset, { color: string; tones?: Partial<ToneSeeds> }>> =
  Object.freeze(presetOptions);
export const presetNames = Object.freeze(Object.keys(presetOptions) as ThemePreset[]);
