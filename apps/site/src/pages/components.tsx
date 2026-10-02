import { Suspense, use } from 'react';
import { useParams } from 'react-router';
import { Heading, Link, Surface } from '@plurid/carved-ui-react';
import { catalog, groups } from '../catalog';
import type { Example } from '../catalog';
import { ApiTable } from '../components/api-table';
import { Specimen } from '../components/specimen';
import type { ExampleModule } from '../components/specimen';
import { NotFound } from './not-found';

// Each page loads only its own examples, and each example once.
const modules = import.meta.glob<ExampleModule>('../examples/*.tsx', { query: '?example' });
const loading = new Map<string, Promise<ExampleModule>>();

function load(file: string): Promise<ExampleModule> {
  let module = loading.get(file);
  if (!module) {
    const importer = modules[`../examples/${file}.tsx`];
    if (!importer) throw new Error(`No example named ${file}`);
    module = importer();
    loading.set(file, module);
  }
  return module;
}

function LiveSpecimen({ title, description, file }: Example) {
  return <Specimen title={title} description={description} module={use(load(file))} />;
}

export function ComponentIndex() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Reference</p>
        <Heading level={1}>Components</Heading>
        <p className="page-lede">
          Ready-made components for the common cases, built on React Aria for keyboard, focus and
          screen reader behaviour. When a layout needs more, compose their parts yourself.
        </p>
      </header>
      {groups.map((group) => (
        <section key={group} className="index-group" aria-labelledby={`group-${group}`}>
          <Heading level={2} id={`group-${group}`}>
            {group}
          </Heading>
          <div className="index-grid">
            {catalog
              .filter((entry) => entry.group === group)
              .map((entry) => (
                <Surface key={entry.slug} className="index-card">
                  <Heading level={3}>
                    <Link href={`/components/${entry.slug}`}>{entry.title}</Link>
                  </Heading>
                  <p>{entry.summary}</p>
                </Surface>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ComponentPage() {
  const { slug } = useParams();
  const entry = catalog.find((candidate) => candidate.slug === slug);
  if (!entry) return <NotFound />;
  // Start every example loading at once, rather than one after another.
  for (const example of entry.examples) void load(example.file);
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">{entry.group}</p>
        <Heading level={1}>{entry.title}</Heading>
        <p className="page-lede">{entry.summary}</p>
      </header>
      <div className="specimens">
        {entry.examples.map((example) => (
          <Suspense key={example.title}>
            <LiveSpecimen {...example} />
          </Suspense>
        ))}
      </div>
      {entry.components.length > 0 && (
        <section className="api-section" aria-labelledby="api">
          <Heading level={2} id="api">
            API
          </Heading>
          {entry.components.map((name) => (
            <ApiTable key={name} name={name} />
          ))}
        </section>
      )}
    </div>
  );
}
