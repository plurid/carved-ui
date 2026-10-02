import { useState } from 'react';
import { Pagination } from '@plurid/carved-ui-react';

export default function Example() {
  const [page, setPage] = useState(6);
  return (
    <div className="stack">
      <Pagination aria-label="Search results" page={page} pageCount={24} onPageChange={setPage} />
      <p className="muted">
        Showing results {(page - 1) * 20 + 1}–{page * 20}
      </p>
    </div>
  );
}

// For a list rendered on the server, give each page a URL instead:
// <Pagination page={page} pageCount={24} href={(number) => `/deploys?page=${number}`} />
