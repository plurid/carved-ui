import {
  clampChroma,
  converter,
  formatHex,
  formatHex8,
  modeA98,
  modeHsl,
  modeHwb,
  modeLab,
  modeLab65,
  modeLch,
  modeLch65,
  modeLrgb,
  modeOklab,
  modeOklch,
  modeP3,
  modeProphoto,
  modeRec2020,
  modeRgb,
  modeXyz50,
  modeXyz65,
  parse,
  useMode,
  wcagLuminance,
} from 'culori/fn';
import type { Oklch } from 'culori/fn';
import { standardTones, themeDefaults, tones } from './tokens.js';
import type { Tone, ToneSeeds } from './tokens.js';

// Register only the colour spaces CSS can express, keeping browser bundles small.
for (const mode of [
  modeRgb,
  modeHsl,
  modeHwb,
  modeLab,
  modeLab65,
  modeLch,
  modeLch65,
  modeLrgb,
  modeOklab,
  modeA98,
  modeP3,
  modeProphoto,
  modeRec2020,
  modeXyz50,
  modeXyz65,
])
  useMode(mode);
const toOklch = useMode(modeOklch);
const toOklab = converter('oklab');

export type ThemeVariables = Record<`--carved-${string}`, string>;

export interface ThemeOptions {
  /** Base colour of the material. Any concrete, opaque CSS colour. */
  color: string;
  /**
   * OKLCH lightness between adjacent depths, 0–0.12. Values below 0.022 are raised to 0.022 so
   * every level stays distinguishable; 0 makes the material flat.
   * @default 0.06
   */
  depthDifference?: number;
  /** Direction light travels, in degrees. 90 is light from above. @default 90 */
  shadowAngle?: number;
  /** Length of a resting carve's shadow in pixels, 0–24. @default 5 */
  shadowDistance?: number;
  /**
   * Inlay colours. `'standard'` uses fixed semantic hues; `'themed'` derives every hue from the
   * base colour, as the original themed button kinds did. An object overrides individual seeds.
   * @default 'standard'
   */
  tones?: 'standard' | 'themed' | Partial<ToneSeeds>;
}

export interface ThemeReport {
  /** Whether the material is dark (light text) or light (dark text). */
  readonly polarity: 'dark' | 'light';
  /** Actual OKLCH lightness between adjacent depths. */
  readonly step: number;
  /** How far surface 0 moved from the requested colour, in OKLCH lightness. */
  readonly shift: number;
  /** Lowest contrast of each tone's fill, ink and on-colour, measured across all surfaces. */
  readonly contrast: Readonly<Record<Tone, { fill: number; ink: number; on: number }>>;
  readonly warnings: readonly string[];
}

export interface Theme {
  readonly variables: Readonly<ThemeVariables>;
  readonly report: ThemeReport;
}

export const DEPTHS = 6;
const ZONES = { dark: { low: 0.11, high: 0.48 }, light: { low: 0.6, high: 1 } } as const;
const POLARITY_SPLIT = 0.59;
const MIN_STEP = 0.022;
const CHROMA_TAPER = 0.92;

const luminances = new Map<string, number>();
function luminance(hex: string): number {
  let value = luminances.get(hex);
  if (value === undefined) {
    value = wcagLuminance(hex);
    luminances.set(hex, value);
  }
  return value;
}
/** WCAG 2 contrast ratio between two hex colours. */
export function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (high + 0.05) / (low + 0.05);
}
const lowest = (color: string, against: readonly string[]) =>
  Math.min(...against.map((other) => contrast(color, other)));

function oklch(l: number, c: number, h: number | undefined): Oklch {
  const color: Oklch = { mode: 'oklch', l: Math.min(1, Math.max(0, l)), c };
  if (h !== undefined) color.h = h;
  return color;
}
function hex(l: number, c: number, h: number | undefined): string {
  return formatHex(clampChroma(oklch(l, c, h), 'oklch'));
}
function translucent(l: number, c: number, h: number | undefined, alpha: number): string {
  return formatHex8({ ...clampChroma(oklch(l, c, h), 'oklch'), alpha });
}

/**
 * The colour with the given hue and chroma whose lightness is closest to `seed` and which
 * satisfies `accept`. Measured on the quantised hex output, so guarantees survive rounding.
 */
function solve(
  seed: Oklch,
  accept: (candidate: string) => boolean,
  lightness = seed.l,
): string | undefined {
  const sample = (l: number) => {
    const candidate = hex(l, seed.c, seed.h);
    return accept(candidate) ? candidate : undefined;
  };
  let best: { l: number; color: string } | undefined;
  for (let l = 0; l <= 1.0001; l += 0.02) {
    const color = sample(l);
    if (color && (!best || Math.abs(l - lightness) < Math.abs(best.l - lightness)))
      best = { l, color };
  }
  if (!best) return undefined;
  // Refine towards the seed: the coarse grid may have skipped a closer passing lightness.
  const direction = Math.sign(lightness - best.l);
  for (let offset = 0.0025; direction && offset < 0.02; offset += 0.0025) {
    const color = sample(best.l + direction * offset);
    if (!color) break;
    best = { l: best.l + direction * offset, color };
  }
  return best.color;
}

/** Interpolate in OKLab from `from` towards `to` until `accept` passes. */
function mixUntil(from: string, to: string, accept: (candidate: string) => boolean): string {
  const a = toOklab(from)!;
  const b = toOklab(to)!;
  for (let t = 0.05; t < 1; t += 0.025) {
    const candidate = formatHex({
      mode: 'oklab',
      l: a.l + (b.l - a.l) * t,
      a: a.a + (b.a - a.a) * t,
      b: a.b + (b.b - a.b) * t,
    });
    if (accept(candidate)) return candidate;
  }
  return to;
}

function finite(name: string, value: number, low: number, high: number) {
  if (!Number.isFinite(value) || value < low || value > high)
    throw new RangeError(`${name} must be between ${low} and ${high}`);
  return value;
}

function parseOpaque(color: string, name = 'Theme color'): Oklch {
  const parsed = typeof color === 'string' ? parse(color) : undefined;
  if (!parsed || (parsed.alpha !== undefined && parsed.alpha < 1))
    throw new TypeError(`${name} must be a concrete opaque CSS color`);
  return clampChroma(toOklch(parsed), 'oklch');
}

function seedsFor(base: Oklch, option: ThemeOptions['tones']): ToneSeeds {
  if (option === 'themed') {
    const hue = base.h ?? 220;
    const chroma = Math.max(base.c, 0.12);
    const at = (offset: number) => `oklch(0.55 ${chroma} ${(hue + offset + 360) % 360})`;
    return { accent: at(50), success: at(110), warning: at(-100), danger: at(-150) };
  }
  return { ...standardTones, ...(typeof option === 'object' ? option : {}) };
}

/**
 * Generate a Carved theme from one colour. Pure, deterministic and safe on the server.
 *
 * Guarantees, for every depth `d`: `fg-d` and `muted-d` reach 4.5:1 on `surface-d`, `edge-d`
 * reaches 3:1, and adjacent surfaces stay distinct. Every `*-ink` reaches 4.5:1 on all six
 * surfaces, every `on-*` reaches 4.5:1 on its fill, and the accent, success and danger fills
 * reach 3:1 on all six surfaces. Warning fills keep their hue and are exempt; see `report`.
 */
export function createTheme(options: ThemeOptions): Theme {
  if (!options || typeof options !== 'object') throw new TypeError('createTheme expects options');
  const base = parseOpaque(options.color);
  const requested = finite(
    'depthDifference',
    options.depthDifference ?? themeDefaults.depthDifference,
    0,
    0.12,
  );
  const angle = finite('shadowAngle', options.shadowAngle ?? themeDefaults.shadowAngle, 0, 360);
  const distance = finite(
    'shadowDistance',
    options.shadowDistance ?? themeDefaults.shadowDistance,
    0,
    24,
  );
  const warnings: string[] = [];
  const variables: ThemeVariables = {};

  // 1. The ramp stays on one side of mid-grey so inlays can contrast with every depth.
  const polarity = base.l > POLARITY_SPLIT ? 'light' : 'dark';
  const zone = ZONES[polarity];
  let top = Math.min(Math.max(base.l, zone.low), zone.high);
  let step = 0;
  if (requested > 0) {
    top = Math.max(top, zone.low + MIN_STEP * (DEPTHS - 1));
    step = Math.max(MIN_STEP, Math.min(requested, (top - zone.low) / (DEPTHS - 1)));
  }
  const hue = base.c < 0.005 ? undefined : base.h;
  const surfaces = Array.from({ length: DEPTHS }, (_, depth) =>
    hex(top - step * depth, base.c * (step > 0 ? CHROMA_TAPER ** depth : 1), hue),
  );
  if (Math.abs(top - base.l) > 0.005)
    warnings.push(`Surface 0 moved ${(top - base.l).toFixed(3)} in lightness to fit the ramp.`);

  // 2. Inks for each depth: text, muted text, control edges and decorative hairlines.
  const inkChroma = Math.min(base.c, 0.015);
  surfaces.forEach((surface, depth) => {
    const ink = oklch(polarity === 'dark' ? 0.97 : 0.2, inkChroma, hue);
    // Prefer 7:1; where the surface cannot reach it, use the strongest ink there is.
    const fg =
      solve(ink, (color) => contrast(color, surface) >= 7) ??
      hex(polarity === 'dark' ? 1 : 0, 0, undefined);
    variables[`--carved-surface-${depth}`] = surface;
    variables[`--carved-fg-${depth}`] = fg;
    variables[`--carved-muted-${depth}`] = mixUntil(
      surface,
      fg,
      (c) => contrast(c, surface) >= 4.6,
    );
    variables[`--carved-edge-${depth}`] = mixUntil(surface, fg, (c) => contrast(c, surface) >= 3.1);
    variables[`--carved-hairline-${depth}`] = mixUntil(
      surface,
      fg,
      (c) => contrast(c, surface) >= 1.35,
    );
  });

  // 3. Inlays: fills that contrast with every depth, text that sits on them, and inks.
  const seeds = seedsFor(base, options.tones);
  const contrastReport = {} as Record<Tone, { fill: number; ink: number; on: number }>;
  for (const tone of tones) {
    const seed = parseOpaque(seeds[tone], `The ${tone} tone`);
    const fill =
      (tone === 'warning' ? undefined : solve(seed, (c) => lowest(c, surfaces) >= 3)) ??
      hex(seed.l, seed.c, seed.h);
    const onCandidates = [
      hex(0.985, Math.min(seed.c, 0.012), seed.h),
      hex(0.18, Math.min(seed.c, 0.03), seed.h),
    ].sort((a, b) => contrast(b, fill) - contrast(a, fill));
    const on =
      contrast(onCandidates[0]!, fill) >= 4.5
        ? onCandidates[0]!
        : solve(
            oklch(luminance(fill) > 0.18 ? 0 : 1, 0, undefined),
            (c) => contrast(c, fill) >= 4.5,
          )!;
    const ink = solve(
      seed,
      (c) => lowest(c, surfaces) >= 4.5,
      polarity === 'dark' ? Math.max(seed.l, 0.8) : Math.min(seed.l, 0.4),
    )!;
    variables[`--carved-${tone}`] = fill;
    variables[`--carved-on-${tone}`] = on;
    variables[`--carved-${tone}-ink`] = ink;
    const fillContrast = lowest(fill, surfaces);
    contrastReport[tone] = {
      fill: round(fillContrast),
      ink: round(lowest(ink, surfaces)),
      on: round(contrast(on, fill)),
    };
    if (fillContrast < 3)
      warnings.push(
        `The ${tone} fill reaches ${fillContrast.toFixed(2)}:1 against the deepest-contrast surface; pair it with text or an icon.`,
      );
  }

  // 4. One light: every shadow, lip and engraving follows the same vector.
  const radians = (angle * Math.PI) / 180;
  const shadowHue = hue ?? 260;
  const shadowChroma = Math.min(base.c, 0.03);
  const dark = polarity === 'dark';
  Object.assign(variables, {
    '--carved-light-x': String(round(Math.cos(radians), 4)),
    '--carved-light-y': String(round(Math.sin(radians), 4)),
    '--carved-shadow-distance': `${round(distance, 2)}px`,
    '--carved-shade': translucent(0.08, shadowChroma, shadowHue, dark ? 0.62 : 0.3),
    '--carved-shade-deep': translucent(0.06, shadowChroma, shadowHue, dark ? 0.78 : 0.42),
    '--carved-lip': translucent(1, 0, undefined, dark ? 0.07 : 0.7),
    '--carved-cast': translucent(0.1, shadowChroma, shadowHue, dark ? 0.55 : 0.2),
    '--carved-scrim': translucent(0.12, shadowChroma, shadowHue, dark ? 0.6 : 0.42),
    '--carved-focus': variables['--carved-accent']!,
    '--carved-color-scheme': polarity,
  } satisfies ThemeVariables);

  return Object.freeze({
    variables: Object.freeze(variables),
    report: Object.freeze({
      polarity,
      step: round(step, 4),
      shift: round(top - base.l, 4),
      contrast: Object.freeze(contrastReport),
      warnings: Object.freeze(warnings),
    }),
  });
}

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
