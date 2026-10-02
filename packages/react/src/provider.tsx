'use client';
import { createContext, useContext, useState } from 'react';
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { I18nProvider, useLocale } from 'react-aria-components/I18nProvider';
import { UNSAFE_PortalProvider } from 'react-aria/PortalProvider';
import { useIsSSR } from 'react-aria/SSRProvider';
import type { Theme, ThemePreset, ThemeVariables } from '@plurid/carved-ui-core';
import { cx } from './internal/class-names.js';

/** Inline styles that may also set Carved's `--carved-*` custom properties. */
export type CarvedStyle = CSSProperties & Partial<ThemeVariables>;
export type Depth = 0 | 1 | 2 | 3 | 4 | 5;

const DepthContext = createContext<Depth>(0);
const HostContext = createContext<HTMLElement | null>(null);

/** The depth of the nearest surface: 0 on the page, 1–5 inside nested surfaces. */
export function useDepth(): Depth {
  return useContext(DepthContext);
}

/** Sets the depth for content rendered away from its surface, such as an overlay's. */
export function DepthScope({ depth, children }: { depth: Depth; children: ReactNode }) {
  return <DepthContext value={depth}>{children}</DepthContext>;
}

/**
 * The depth of something cut into the current surface: an overlay opened from here, or a well
 * that holds controls of its own. It is one level deeper, so its controls can cut deeper still.
 */
export function useCutDepth(): Depth {
  return Math.min(useDepth() + 1, 5) as Depth;
}

export interface CarvedProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'style' | 'dir'> {
  /**
   * A preset name, or a theme from `createTheme`. Presets are applied by the stylesheet;
   * generated themes are applied inline.
   * @default 'ponton'
   */
  theme?: ThemePreset | Theme;
  /**
   * A BCP 47 locale for formatting and text direction. Inherited from an enclosing provider
   * when omitted.
   */
  locale?: string;
  style?: CarvedStyle;
}

/**
 * A themed scope. Everything inside, including popovers and dialogs, uses its theme,
 * locale and text direction. Providers can nest to theme part of a page differently.
 */
export function CarvedProvider({ locale, ...props }: CarvedProviderProps) {
  if (!locale) return <Scope {...props} />;
  return (
    <I18nProvider locale={locale}>
      <Scope {...props} localized />
    </I18nProvider>
  );
}

function Scope({
  theme = 'ponton',
  localized = false,
  className,
  style,
  children,
  ...props
}: Omit<CarvedProviderProps, 'locale'> & { localized?: boolean }) {
  if (typeof theme === 'object' && !theme?.variables)
    throw new TypeError('CarvedProvider expects a preset name or a theme from createTheme');
  const { locale, direction } = useLocale();
  const parentHost = useContext(HostContext);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const hydrating = useIsSSR();

  const variables = typeof theme === 'object' ? theme.variables : undefined;
  // Direction and language are set only by an explicit locale; otherwise they are inherited,
  // so a browser's default language never flips an application's layout.
  const scope = {
    'data-carved-theme': typeof theme === 'object' ? 'custom' : theme,
    'data-carved-depth': 0,
    ...(localized ? { dir: direction, lang: locale } : {}),
  };
  // Overlays render into this host so they inherit the scope through the DOM. A nested
  // provider's host moves into the root host, beyond any scrolling or clipping container.
  const portalHost = (
    <div
      {...scope}
      ref={setHost}
      className="carved-portal-host"
      style={{ ...variables, ...customProperties(style) }}
    />
  );
  return (
    <div
      {...props}
      {...scope}
      className={cx('carved-provider', className)}
      style={{ ...variables, ...style }}
    >
      <HostContext value={host}>
        <DepthContext value={0}>
          <UNSAFE_PortalProvider getContainer={host ? () => host : undefined}>
            {children}
          </UNSAFE_PortalProvider>
        </DepthContext>
      </HostContext>
      {parentHost && !hydrating ? createPortal(portalHost, parentHost) : portalHost}
    </div>
  );
}

function customProperties(style: CarvedStyle | undefined) {
  if (!style) return undefined;
  return Object.fromEntries(Object.entries(style).filter(([key]) => key.startsWith('--')));
}

type SurfaceElement =
  'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav';

export interface SurfaceProps extends Omit<ComponentPropsWithRef<'div'>, 'style'> {
  /**
   * How deep this surface is cut. Defaults to one level below the enclosing surface;
   * levels saturate at 5.
   */
  depth?: Depth;
  /** The element to render, for landmark and sectioning semantics. @default 'div' */
  as?: SurfaceElement;
  style?: CarvedStyle;
}

/** A recess cut into the material. Each nested surface sits one level deeper and darker. */
export function Surface({
  depth,
  as: Element = 'div',
  className,
  children,
  ...props
}: SurfaceProps) {
  const parent = useDepth();
  if (depth !== undefined && !(Number.isInteger(depth) && depth >= 0 && depth <= 5))
    throw new RangeError('Surface depth must be an integer from 0 through 5');
  const level = depth ?? (Math.min(parent + 1, 5) as Depth);
  return (
    <DepthContext value={level}>
      <Element
        {...props}
        className={cx('carved-surface carved-carve', className)}
        data-carved-depth={level}
      >
        {children}
      </Element>
    </DepthContext>
  );
}

/** A padded surface for grouping related content. Compose with the `Card*` parts. */
export function Card({ className, ...props }: SurfaceProps) {
  return <Surface {...props} className={cx('carved-card', className)} />;
}
