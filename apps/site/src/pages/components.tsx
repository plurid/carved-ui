import { useParams } from 'react-router';
import { Heading, Link, Surface } from '@plurid/carved-ui-react';
import { catalog, groups } from '../catalog';
import { ApiTable } from '../components/api-table';
import { Specimen } from '../components/specimen';
import { NotFound } from './not-found';

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
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">{entry.group}</p>
        <Heading level={1}>{entry.title}</Heading>
        <p className="page-lede">{entry.summary}</p>
      </header>
      <div className="specimens">
        {entry.examples.map((example) => (
          <Specimen key={example.title} {...example} />
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
