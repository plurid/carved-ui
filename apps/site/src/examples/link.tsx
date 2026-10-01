import { Link } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack">
      <p>
        Read the <Link href="#guide">deployment guide</Link> before your first release.
      </p>
      <div className="row">
        <Link href="#docs" variant="primary">
          Open the docs
        </Link>
        <Link href="#source" variant="secondary">
          View source
        </Link>
      </div>
    </div>
  );
}
