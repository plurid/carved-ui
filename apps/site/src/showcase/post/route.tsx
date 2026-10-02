import { Navigate, useParams } from 'react-router';
import { setSiteTheme, useSiteTheme } from '../../theme';
import { labels, mailboxes } from './places';
import type { Label, Mailbox } from './places';
import { Post } from './post';

const base = '/showcase/mail';

/**
 * The site's way into Post: it reads the place from the path and hands the app the site's
 * theme. Post itself knows nothing of the site.
 */
export function PostRoute() {
  const rest = useParams()['*'] ?? '';
  const theme = useSiteTheme();
  const [first, second] = rest.split('/');
  const label = first === 'labels' ? labels.find((item) => item.slug === second)?.slug : undefined;
  const mailbox = first ? mailboxes.find((item) => item.slug === first)?.slug : 'inbox';
  if (!label && !mailbox) return <Navigate to={base} replace />;
  return (
    <Post
      mailbox={(mailbox ?? 'inbox') as Mailbox}
      label={(label ?? null) as Label | null}
      base={base}
      exitHref="/showcase"
      theme={theme}
      onThemeChange={setSiteTheme}
    />
  );
}
