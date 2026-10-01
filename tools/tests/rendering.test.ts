import { describe, expect, it } from 'vitest';
import { createElement as h } from 'react';
import type { ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { createTheme } from '@plurid/carved-ui-core';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CarvedProvider,
  Heading,
  IconButton,
  Select,
  SelectItem,
  Surface,
  TextField,
} from '@plurid/carved-ui-react';

const html = (node: ReactNode) => renderToString(node);

describe('server rendering', () => {
  it('renders a themed tree without browser globals', () => {
    const markup = html(
      h(
        CarvedProvider,
        { theme: createTheme({ color: '#456789' }) },
        h(Card, null, h(CardHeader, null, h(CardTitle, null, 'Project')), h(Button, null, 'Save')),
      ),
    );
    expect(markup).toContain('data-carved-theme="custom"');
    expect(markup).toContain('--carved-surface-0:');
    expect(markup).toContain('<button');
  });

  it('applies presets through the stylesheet instead of inline variables', () => {
    const markup = html(h(CarvedProvider, { theme: 'night' }, 'Content'));
    expect(markup).toContain('data-carved-theme="night"');
    expect(markup).not.toContain('--carved-surface-0');
  });

  it('renders the overlay host inside the provider', () => {
    const markup = html(h(CarvedProvider, null, 'Content'));
    expect(markup).toMatch(/class="carved-portal-host"/);
  });

  it('renders composed fields with labels and descriptions', () => {
    const markup = html(h(TextField, { label: 'Email', description: 'For receipts.' }));
    expect(markup).toContain('Email');
    expect(markup).toContain('For receipts.');
    expect(markup).toMatch(/aria-describedby="[^"]+"/);
    expect(
      html(h(Select, { label: 'Plan', children: h(SelectItem, { id: 'free' }, 'Free') })),
    ).toContain('Plan');
  });

  it('works without a provider', () => {
    expect(html(h(Button, null, 'Save'))).toContain('<button');
  });
});

describe('depth', () => {
  it('advances only at surfaces, through any wrapper, and stops at five', () => {
    let child: ReactNode = h('p', null, 'Deepest');
    for (let level = 0; level < 7; level++) child = h('section', null, h(Surface, null, child));
    const depths = [
      ...html(h(CarvedProvider, null, child)).matchAll(
        /class="carved-surface[^"]*" data-carved-depth="(\d)"/g,
      ),
    ];
    expect(depths.map((match) => Number(match[1]))).toEqual([1, 2, 3, 4, 5, 5, 5]);
  });

  it('accepts an explicit depth and rejects invalid ones', () => {
    expect(html(h(Surface, { depth: 3 }, 'Deep'))).toContain('data-carved-depth="3"');
    expect(() => html(h(Surface, { depth: 7 as 0 }))).toThrow(RangeError);
  });
});

describe('locale', () => {
  it('sets direction and language only when a locale is given', () => {
    expect(html(h(CarvedProvider, null, 'x'))).not.toContain('dir=');
    const arabic = html(h(CarvedProvider, { locale: 'ar-EG' }, 'x'));
    expect(arabic).toContain('dir="rtl"');
    expect(arabic).toContain('lang="ar-EG"');
  });

  it('lets nested providers inherit the locale', () => {
    const markup = html(
      h(CarvedProvider, { locale: 'he-IL' }, h(CarvedProvider, { theme: 'light' }, 'x')),
    );
    expect(markup.match(/dir="rtl"/g)).toHaveLength(2); // the outer provider and its overlay host
  });
});

describe('content', () => {
  it('keeps heading levels and engraved styling', () => {
    const markup = html(h(Heading, { level: 1, variant: 'engraved' }, 'Carved'));
    expect(markup).toMatch(/^<h1[^>]*class="carved-heading carved-engrave"/);
  });

  it('only announces alerts when asked to', () => {
    expect(html(h(Alert, null, 'Saved'))).not.toContain('role=');
    expect(html(h(Alert, { live: 'polite' }, 'Saved'))).toContain('role="status"');
    expect(html(h(Alert, { live: 'assertive', tone: 'danger' }, 'Failed'))).toContain(
      'role="alert"',
    );
  });

  it('inlays badges with their tone', () => {
    expect(html(h(Badge, { tone: 'success' }, 'Live'))).toContain('data-tone="success"');
  });

  it('requires a name for icon buttons', () => {
    expect(() => html(h(IconButton, { 'aria-label': ' ' }, 'x'))).toThrow('non-empty aria-label');
  });
});
