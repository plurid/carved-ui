import { Badge, Card, Heading, Link } from '@plurid/carved-ui-react';
import { showcase } from './meta';

/** The showcase's front page: one card for each app, with a picture of it. */
export function Showcase() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Built with Carved</p>
        <Heading level={1}>Showcase</Heading>
        <p className="page-lede">
          Three working applications made only of Carved components. Open one, use it, change its
          material from its header, and read its source.
        </p>
      </header>
      <div className="showcase-apps">
        {showcase.map((app) => (
          <Card key={app.path} as="article" className="showcase-card">
            <img
              src={`${import.meta.env.BASE_URL}showcase/${app.path.split('/').pop()}.jpg`}
              alt=""
              width={1280}
              height={800}
              loading="lazy"
              className="showcase-shot"
            />
            <div className="showcase-card-text">
              <p className="eyebrow">{app.kind}</p>
              <Heading level={2}>{app.name}</Heading>
              <p>{app.summary}</p>
              <ul className="showcase-highlights" aria-label="Built from">
                {app.highlights.map((name) => (
                  <li key={name}>
                    <Badge>{name}</Badge>
                  </li>
                ))}
              </ul>
              <div className="row">
                <Link href={app.path} variant="primary">
                  Open {app.name}
                </Link>
                <Link href={app.source} target="_blank" rel="noreferrer">
                  Source
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
