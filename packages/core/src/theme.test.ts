import { describe, expect, it } from 'vitest';
import { converter, differenceEuclidean, formatHex } from 'culori';
import { DEPTHS, contrast, createTheme, presetNames, presets, tones } from './theme.js';
import type { Theme } from './theme.js';
import { coreStylesheet, depthCss, themeToCss, tokensCss } from './css.js';
import { toDtcg } from './dtcg.js';

const toOklch = converter('oklch');
const distance = differenceEuclidean('oklab');
const levels = Array.from({ length: DEPTHS }, (_, depth) => depth);

/** A small deterministic PRNG, so the sweep is reproducible. */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const next = random(20190211);
const sweep = Array.from({ length: 500 }, () =>
  formatHex({ mode: 'rgb', r: next(), g: next(), b: next() }),
);

function expectGuarantees(theme: Theme) {
  const v = theme.variables;
  const surfaces = levels.map((d) => v[`--carved-surface-${d}`]!);
  const light = contrast(v['--carved-fg-0']!, '#000') > contrast(v['--carved-fg-0']!, '#fff');
  for (const d of levels) {
    const surface = surfaces[d]!;
    expect(contrast(v[`--carved-fg-${d}`]!, surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(v[`--carved-muted-${d}`]!, surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(v[`--carved-edge-${d}`]!, surface)).toBeGreaterThanOrEqual(3);
    // Text polarity never flips between depths.
    const fg = v[`--carved-fg-${d}`]!;
    expect(contrast(fg, '#000') > contrast(fg, '#fff')).toBe(light);
    if (d > 0 && theme.report.step > 0)
      expect(distance(surface, surfaces[d - 1]!)).toBeGreaterThanOrEqual(0.018);
  }
  for (const tone of tones) {
    const fill = v[`--carved-${tone}`]!;
    const lowest = (color: string) => Math.min(...surfaces.map((s) => contrast(color, s)));
    if (tone !== 'warning') expect(lowest(fill)).toBeGreaterThanOrEqual(3);
    expect(contrast(v[`--carved-on-${tone}`]!, fill)).toBeGreaterThanOrEqual(4.5);
    expect(lowest(v[`--carved-${tone}-ink`]!)).toBeGreaterThanOrEqual(4.5);
  }
}

describe('createTheme', () => {
  for (const name of presetNames)
    it(`keeps every guarantee for the ${name} preset`, () => {
      expectGuarantees(createTheme(presets[name]));
    });

  it('keeps every guarantee for 500 random colours', () => {
    for (const color of sweep) expectGuarantees(createTheme({ color }));
  });

  it('keeps every guarantee with themed tones and extreme tuning', () => {
    for (const color of sweep.slice(0, 60)) {
      expectGuarantees(createTheme({ color, tones: 'themed' }));
      expectGuarantees(createTheme({ color, depthDifference: 0.12, shadowAngle: 300 }));
      expectGuarantees(createTheme({ color, depthDifference: 0.001 }));
    }
  });

  it('keeps the hue of chromatic materials across depths', () => {
    for (const color of ['#910808', '#da840b', '#394d60', '#2952a3', '#3c8f5a']) {
      const { variables } = createTheme({ color });
      const base = toOklch(variables['--carved-surface-0'])!;
      for (const d of levels) {
        const surface = toOklch(variables[`--carved-surface-${d}`])!;
        if (surface.c > 0.03 && base.h !== undefined && surface.h !== undefined) {
          const drift = Math.abs(((surface.h - base.h + 540) % 360) - 180);
          expect(drift).toBeLessThanOrEqual(3);
        }
      }
    }
  });

  it('never collapses the darkest material', () => {
    const { variables } = createTheme({ color: '#000' });
    const surfaces = new Set(levels.map((d) => variables[`--carved-surface-${d}`]));
    expect(surfaces.size).toBe(DEPTHS);
  });

  it('makes a flat material when depthDifference is zero', () => {
    const { variables, report } = createTheme({ color: '#345678', depthDifference: 0 });
    expect(report.step).toBe(0);
    expect(variables['--carved-surface-0']).toBe(variables['--carved-surface-5']);
  });

  it('follows the light angle', () => {
    const above = createTheme({ color: '#345678' }).variables;
    expect([above['--carved-light-x'], above['--carved-light-y']]).toEqual(['0', '1']);
    const left = createTheme({ color: '#345678', shadowAngle: 0, shadowDistance: 8 }).variables;
    expect([left['--carved-light-x'], left['--carved-light-y']]).toEqual(['1', '0']);
    expect(left['--carved-shadow-distance']).toBe('8px');
  });

  it('accepts any concrete CSS colour and is deterministic and frozen', () => {
    for (const color of ['#fff', 'hsl(220 30% 40%)', 'rgb(100 150 200)', 'oklch(65% .2 140)', 'teal']) {
      const theme = createTheme({ color });
      expect(theme).toEqual(createTheme({ color }));
      expect(Object.isFrozen(theme.variables)).toBe(true);
      expect(Object.isFrozen(theme.report)).toBe(true);
    }
  });

  it('accepts custom tone seeds', () => {
    const theme = createTheme({ color: '#f6f5f1', tones: { accent: '#7a2fd0' } });
    const accent = toOklch(theme.variables['--carved-accent'])!;
    expect(accent.h).toBeGreaterThan(280);
    expect(accent.h).toBeLessThan(320);
  });

  it.each(['nonsense', 'var(--brand)', 'currentColor', 'rgb(0 0 0 / .5)', 'transparent'])(
    'rejects unresolved or translucent colours: %s',
    (color) => {
      expect(() => createTheme({ color })).toThrow('concrete opaque CSS color');
    },
  );

  it('rejects translucent tone seeds', () => {
    expect(() => createTheme({ color: '#123', tones: { danger: '#f008' } })).toThrow('danger tone');
  });

  it.each([
    ['depthDifference', NaN],
    ['depthDifference', -0.01],
    ['depthDifference', 0.13],
    ['shadowAngle', 361],
    ['shadowDistance', Infinity],
  ])('rejects %s = %s', (option, value) => {
    expect(() => createTheme({ color: '#123456', [option]: value })).toThrow(RangeError);
  });

  it('is fast enough for live editing', () => {
    const start = performance.now();
    for (const color of sweep.slice(0, 50)) createTheme({ color });
    expect((performance.now() - start) / 50).toBeLessThan(10);
  });
});

describe('stylesheet output', () => {
  it('serialises themes, presets and depth rules', () => {
    const css = tokensCss();
    expect(css).not.toContain('undefined');
    expect(css).toContain(':root, [data-carved-theme="ponton"] {');
    for (const name of presetNames) {
      const block = css.split(`[data-carved-theme="${name}"] {`)[1]!.split('}')[0]!;
      for (const [key, value] of Object.entries(createTheme(presets[name]).variables))
        expect(block).toContain(`${key}: ${value};`);
    }
    expect(depthCss().match(/data-carved-depth/g)).toHaveLength(DEPTHS);
    expect(themeToCss(createTheme({ color: '#123456' }), '.brand')).toMatch(/^\.brand \{/);
  });

  it('declares the cascade layers before any rule', () => {
    expect(coreStylesheet('.x{}').split('\n')[0]).toBe(
      '@layer carved.tokens, carved.material, carved.components;',
    );
  });

  it('exports DTCG colour tokens for every preset', () => {
    const tokens = toDtcg();
    for (const name of presetNames) {
      const surface = tokens.theme[name]!.surface['0']!;
      expect(surface.$type).toBe('color');
      expect(surface.$value.colorSpace).toBe('srgb');
      expect(surface.$value.hex).toBe(createTheme(presets[name]).variables['--carved-surface-0']);
    }
  });
});
