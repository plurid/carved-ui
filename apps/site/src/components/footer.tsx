import { Link, Separator } from '@plurid/carved-ui-react';

export function Footer() {
  return (
    <footer className="site-footer">
      <Separator variant="trench" />
      <div className="site-footer-row">
        <p>Carved UI is MIT licensed. Built with Carved, on React Aria.</p>
        <nav aria-label="Elsewhere" className="row">
          <Link href="https://github.com/plurid/carved-ui" target="_blank" rel="noreferrer">
            Source
          </Link>
          <Link href={`${import.meta.env.BASE_URL}lab/`} target="_blank" rel="noreferrer">
            Laboratory
          </Link>
          <Link
            href="https://www.npmjs.com/package/@plurid/carved-ui-react"
            target="_blank"
            rel="noreferrer"
          >
            npm
          </Link>
        </nav>
      </div>
    </footer>
  );
}
