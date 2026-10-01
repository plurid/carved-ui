import { useLocation } from 'react-router';
import { Link } from '@plurid/carved-ui-react';
import { catalog, groups } from '../catalog';
import { guides } from '../routes';

function NavLink({ href, children }: { href: string; children: string }) {
  const current = useLocation().pathname === href;
  return (
    <Link
      href={href}
      className={current ? 'nav-link carved-carve' : 'nav-link'}
      aria-current={current ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

/** Every page of the documentation, grouped. */
export function DocsNavigation() {
  return (
    <div className="nav-groups">
      <section aria-labelledby="nav-guides">
        <h2 id="nav-guides" className="nav-title">
          Guides
        </h2>
        <ul>
          {guides.map((guide) => (
            <li key={guide.path}>
              <NavLink href={guide.path}>{guide.title}</NavLink>
            </li>
          ))}
          <li>
            <NavLink href="/recipes">Recipes</NavLink>
          </li>
        </ul>
      </section>
      {groups.map((group) => (
        <section key={group} aria-labelledby={`nav-${group}`}>
          <h2 id={`nav-${group}`} className="nav-title">
            {group}
          </h2>
          <ul>
            {catalog
              .filter((entry) => entry.group === group)
              .map((entry) => (
                <li key={entry.slug}>
                  <NavLink href={`/components/${entry.slug}`}>{entry.title}</NavLink>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
