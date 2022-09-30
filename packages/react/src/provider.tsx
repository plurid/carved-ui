'use client';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentPropsWithRef, CSSProperties, RefObject } from 'react';
import { I18nProvider } from 'react-aria-components';
import { presets } from '@plurid/carved-ui-core';
import type { Theme, ThemePreset, ThemeVariables } from '@plurid/carved-ui-core';
import { cx } from './internal/utils.js';

export type CarvedStyle = CSSProperties & Partial<ThemeVariables>;
export interface CarvedProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'style'> {
  theme?: ThemePreset | Theme;
  locale?: string;
  style?: CarvedStyle;
}
interface ThemeScope {
  theme: Theme;
  scope: RefObject<HTMLDivElement | null> | null;
}
const ThemeContext = createContext<ThemeScope>({ theme: presets.ponton, scope: null });
const DepthContext = createContext(0);
export type Depth = 0 | 1 | 2 | 3 | 4 | 5;

export function CarvedProvider({
  theme = 'ponton',
  locale = 'en-US',
  className,
  style,
  children,
  ref,
  ...props
}: CarvedProviderProps) {
  const resolved = typeof theme === 'string' ? presets[theme] : theme;
  if (!resolved?.variables) throw new TypeError('CarvedProvider requires a valid theme');
  const scope = useRef<HTMLDivElement>(null);
  const context = useMemo(() => ({ theme: resolved, scope }), [resolved]);
  return (
    <I18nProvider locale={locale}>
      <ThemeContext value={context}>
        <DepthContext value={0}>
          <div
            {...props}
            ref={(node) => {
              scope.current = node;
              if (typeof ref === 'function') return ref(node);
              if (ref) ref.current = node;
            }}
            className={cx('carved-provider', className)}
            data-carved-theme={typeof theme === 'string' ? theme : 'custom'}
            style={{ ...resolved.variables, ...style }}
          >
            {children}
          </div>
        </DepthContext>
      </ThemeContext>
    </I18nProvider>
  );
}
export interface SurfaceProps extends Omit<ComponentPropsWithRef<'div'>, 'style'> {
  depth?: Depth;
  style?: CarvedStyle;
}
export function Surface({ depth, className, style, children, ref, ...props }: SurfaceProps) {
  const { theme } = useContext(ThemeContext);
  const scope = useRef<HTMLDivElement>(null);
  const context = useMemo(() => ({ theme, scope }), [theme]);
  const parent = useContext(DepthContext);
  if (depth !== undefined && (!Number.isInteger(depth) || depth < 0 || depth > 5))
    throw new RangeError('Surface depth must be an integer from zero through five');
  const level = depth ?? Math.min(parent + 1, 5);
  const tokens: CarvedStyle = {
    '--carved-bg': `var(--carved-surface-${level})`,
    '--carved-fg': `var(--carved-fg-${level})`,
    '--carved-muted': `var(--carved-muted-${level})`,
    '--carved-border': `var(--carved-border-${level})`,
    '--carved-focus': `var(--carved-fg-${level})`,
  };
  return (
    <ThemeContext value={context}>
      <DepthContext value={level}>
        <div
          {...props}
          ref={(node) => {
            scope.current = node;
            if (typeof ref === 'function') return ref(node);
            if (ref) ref.current = node;
          }}
          className={cx('carved-surface', className)}
          data-carved-depth={level}
          style={{ ...tokens, ...style }}
        >
          {children}
        </div>
      </DepthContext>
    </ThemeContext>
  );
}

/** Capture the owning CSS scope, including application overrides, across React Aria portals. */
export function useOverlayStyle(): CarvedStyle {
  const { theme, scope } = useContext(ThemeContext);
  const [overrides, setOverrides] = useState<CarvedStyle>({});
  useEffect(() => {
    const element = scope?.current;
    if (!element) return;
    const update = () => {
      const computed = getComputedStyle(element);
      const variables: ThemeVariables = {};
      for (const property of Array.from(computed))
        if (property.startsWith('--carved-'))
          variables[property as keyof ThemeVariables] = computed.getPropertyValue(property).trim();
      setOverrides({ ...variables, direction: computed.direction as CSSProperties['direction'] });
    };
    update();
    const observer = new MutationObserver(update);
    for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement)
      observer.observe(ancestor, {
        attributes: true,
        attributeFilter: ['class', 'style', 'dir', 'data-carved-theme'],
      });
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', update);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
    };
  }, [theme, scope]);
  return { ...theme.variables, ...overrides };
}
