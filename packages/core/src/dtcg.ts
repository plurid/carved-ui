import { parse } from 'culori/fn';
import { foundation, presetNames, presets, tones } from './tokens.js';
import { DEPTHS, createTheme } from './theme.js';

function color(hex: string) {
  const rgb = parse(hex);
  if (!rgb || rgb.mode !== 'rgb') throw new TypeError(`Expected an sRGB colour, received ${hex}`);
  const round = (value: number) => Math.round(value * 10000) / 10000;
  return {
    $type: 'color',
    $value: {
      colorSpace: 'srgb',
      components: [round(rgb.r), round(rgb.g), round(rgb.b)],
      alpha: rgb.alpha ?? 1,
      hex: hex.slice(0, 7),
    },
  } as const;
}

/**
 * Carved's tokens in the Design Tokens Community Group format: the foundation, and the
 * resolved colours of every preset. Shadows are composed in CSS and are not exported.
 */
export function toDtcg() {
  const themes = Object.fromEntries(
    presetNames.map((name) => {
      const { variables } = createTheme(presets[name]);
      const depth = (key: string) =>
        Object.fromEntries(
          Array.from({ length: DEPTHS }, (_, level) => [
            String(level),
            color(variables[`--carved-${key}-${level}`]!),
          ]),
        );
      const tone = Object.fromEntries(
        tones.map((key) => [
          key,
          {
            fill: color(variables[`--carved-${key}`]!),
            on: color(variables[`--carved-on-${key}`]!),
            ink: color(variables[`--carved-${key}-ink`]!),
          },
        ]),
      );
      return [
        name,
        {
          surface: depth('surface'),
          fg: depth('fg'),
          muted: depth('muted'),
          edge: depth('edge'),
          ...tone,
        },
      ];
    }),
  );
  return { $description: 'Carved UI design tokens', ...foundation, theme: themes };
}
