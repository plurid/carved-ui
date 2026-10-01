import { Link } from '@plurid/carved-ui-react';

/** Page links for server-rendered lists. `href` builds the URL of a page. */
export function Pagination({
  page,
  pages,
  href,
}: {
  page: number;
  pages: number;
  href: (page: number) => string;
}) {
  return (
    <nav aria-label="Pagination" className="recipe-pagination">
      <Link variant="ghost" size="sm" href={href(page - 1)} isDisabled={page <= 1}>
        Previous
      </Link>
      {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
        <Link
          key={number}
          variant={number === page ? 'secondary' : 'ghost'}
          size="sm"
          href={href(number)}
          aria-current={number === page ? 'page' : undefined}
          aria-label={`Page ${number}`}
        >
          {number}
        </Link>
      ))}
      <Link variant="ghost" size="sm" href={href(page + 1)} isDisabled={page >= pages}>
        Next
      </Link>
    </nav>
  );
}
