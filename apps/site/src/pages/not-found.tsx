import { Heading, Link } from '@plurid/carved-ui-react';

export function NotFound() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">404</p>
        <Heading level={1}>This page isn’t here</Heading>
        <p className="page-lede">
          It may have moved when the documentation was rewritten for version 1.
        </p>
      </header>
      <p className="row">
        <Link href="/" variant="primary">
          Go to the home page
        </Link>
        <Link href="/components" variant="secondary">
          Browse components
        </Link>
      </p>
    </div>
  );
}
