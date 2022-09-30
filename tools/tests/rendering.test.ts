import { describe, it, expect } from 'vitest';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { createTheme } from '@plurid/carved-ui-core';
import {
  CarvedProvider,
  Surface,
  Button,
  Heading,
  Badge,
  IconButton,
  Card,
  CardHeader,
  CardTitle,
} from '@plurid/carved-ui-react';

describe('server rendering and public exports', () => {
  it('renders without browser globals or a process-wide reset', () => {
    const html = renderToString(
      h(
        CarvedProvider,
        { theme: createTheme({ color: '#456789' }) },
        h(Card, null, h(CardHeader, null, h(CardTitle, null, 'Project')), h(Button, null, 'Save')),
      ),
    );
    expect(html).toContain('data-carved-theme="custom"');
    expect(html).toContain('<button');
    expect(html).toContain('Project');
  });
  it('supports controls without a mandatory provider', () => {
    expect(renderToString(h(Button, null, 'Save'))).toContain('<button');
  });
  it('advances depth only at surfaces and saturates at five through arbitrary wrappers', () => {
    let child = h('p', null, 'Deepest');
    for (let level = 0; level < 7; level++) child = h('section', null, h(Surface, null, child));
    const html = renderToString(h(CarvedProvider, null, child));
    expect(
      [...html.matchAll(/data-carved-depth="(\d)"/g)].map((match) => Number(match[1])),
    ).toEqual([1, 2, 3, 4, 5, 5, 5]);
  });
  it('allows explicit depth and rejects invalid explicit levels', () => {
    expect(renderToString(h(Surface, { depth: 0 }, 'Root'))).toContain('data-carved-depth="0"');
    // JavaScript consumers still receive validation at runtime.
    expect(() => renderToString(h(Surface, { depth: -1 as 0 }))).toThrow(RangeError);
  });
  it('does not share themes across independent renders', () => {
    const light = renderToString(h(CarvedProvider, { theme: 'light' }, h(Badge, null, 'Light')));
    const night = renderToString(h(CarvedProvider, { theme: 'night' }, h(Badge, null, 'Night')));
    expect(light).not.toEqual(night);
    expect(renderToString(h(CarvedProvider, { theme: 'light' }, h(Badge, null, 'Light')))).toBe(
      light,
    );
  });
  it('retains heading semantics and requires names for icon actions', () => {
    expect(renderToString(h(Heading, { level: 3 }, 'Details'))).toContain('<h3');
    expect(() => renderToString(h(IconButton, { 'aria-label': '' }, 'Icon'))).toThrow(
      'nonempty aria-label',
    );
  });
});
