import { describe, expect, it } from 'vitest';
import { extract } from '../../apps/site/vite/api.ts';
import { catalog } from '../../apps/site/src/catalog.ts';

// The site's API tables are generated from the components' types and JSDoc: every component it
// documents must say what it is, and every prop what it does.
describe('API documentation', () => {
  const api = extract();
  const documented = [...new Set(catalog.flatMap((entry) => entry.components))];

  it.each(documented)('%s has a description and documents every prop', (name) => {
    const entry = api[name];
    expect(entry, `${name} is not exported as a component`).toBeDefined();
    expect(entry!.description, `${name} has no description`).not.toBe('');
    expect(
      entry!.props.filter((prop) => !prop.description).map((prop) => prop.name),
      `${name} has undocumented props`,
    ).toEqual([]);
  });
});
