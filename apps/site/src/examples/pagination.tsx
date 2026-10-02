import { useState } from 'react';
import { Pagination } from '@plurid/carved-ui-react';

export default function Example() {
  const [page, setPage] = useState(6);
  return (
    <div className="stack">
      <Pagination aria-label="Search results" page={page} pageCount={24} onPageChange={setPage} />
      <Pagination
        aria-label="Archive"
        page={2}
        pageCount={4}
        href={(number) => `?page=${number}`}
      />
    </div>
  );
}
