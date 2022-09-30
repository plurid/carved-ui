import { foundation } from './tokens.js';
import type { FoundationToken } from './tokens.js';
import { DEPTHS, createTheme, presetNames, presets } from './theme.js';
import type { Theme } from './theme.js';

function cssValue(token: FoundationToken): string {
  switch (token.$type) {
    case 'dimension':
      return token.$value.value === 0 ? '0' : `${token.$value.value}${token.$value.unit}`;
    case 'duration':
      return `${token.$value.value}${token.$value.unit}`;
    case 'fontFamily':
      return token.$value.map((name) => (/\s/.test(name) ? `"${name}"` : name)).join(', ');
    case 'cubicBezier':
      return `cubic-bezier(${token.$value.join(', ')})`;
    case 'number':
      return String(token.$value);
  }
}

/** Foundation tokens (space, radius, type, motion, layers) as `--carved-*` custom properties. */
export function foundationVariables(): Record<`--carved-${string}`, string> {
  const variables: Record<`--carved-${string}`, string> = {};
  for (const [group, entries] of Object.entries(foundation))
    for (const [name, token] of Object.entries(entries))
      variables[`--carved-${group}-${name}`] = cssValue(token as FoundationToken);
  return variables;
}

const rule = (selector: string, declarations: Record<string, string>) =>
  `${selector} {\n${Object.entries(declarations)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n')}\n}`;

/** Serialise a theme as one CSS rule, for server-rendered or provider-less pages. */
export function themeToCss(theme: Theme, selector = ':root'): string {
  return rule(selector, theme.variables);
}

/**
 * Depth rules. An element at depth `d` reads its own colours from level `d`, and the colours of
 * anything it carves into itself (a field well, a button's recess) from level `d + 1`.
 */
export function depthCss(): string {
  return Array.from({ length: DEPTHS }, (_, depth) => {
    const cut = Math.min(depth + 1, DEPTHS - 1);
    const map = (name: string, level: number) => `var(--carved-${name}-${level})`;
    // A theme scope always starts at depth 0, even without an explicit depth attribute.
    const scope = depth === 0 ? ':root, [data-carved-theme], ' : '';
    return rule(`${scope}[data-carved-depth="${depth}"]`, {
      '--carved-bg': map('surface', depth),
      '--carved-fg': map('fg', depth),
      '--carved-muted': map('muted', depth),
      '--carved-edge': map('edge', depth),
      '--carved-hairline': map('hairline', depth),
      '--carved-cut': map('surface', cut),
      '--carved-cut-fg': map('fg', cut),
      '--carved-cut-muted': map('muted', cut),
    });
  }).join('\n');
}

/** Every token rule: foundation, the seven presets (ponton is the default) and depth mapping. */
export function tokensCss(): string {
  const themes = presetNames.map((name) =>
    themeToCss(
      createTheme(presets[name]),
      `${name === 'ponton' ? ':root, ' : ''}[data-carved-theme="${name}"]`,
    ),
  );
  return [rule(':root', foundationVariables()), ...themes, depthCss()].join('\n');
}

/** The complete core stylesheet: cascade layer order, tokens and the material primitives. */
export function coreStylesheet(materialCss: string): string {
  return [
    '@layer carved.tokens, carved.material, carved.components;',
    `@layer carved.tokens {\n${tokensCss()}\n}`,
    `@layer carved.material {\n${materialCss}\n}`,
  ].join('\n');
}
