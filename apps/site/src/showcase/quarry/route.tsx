import { Navigate, useNavigate, useParams } from 'react-router';
import { setSiteTheme, useSiteTheme } from '../../theme';
import { consolePages } from './places';
import { Quarry } from './quarry';

const base = '/showcase/console';

/**
 * The site's way into Quarry: it reads the page from the path and hands the app the site's
 * router and theme. Quarry itself knows nothing of the site.
 */
export function QuarryRoute() {
  const rest = useParams()['*'] ?? '';
  const navigate = useNavigate();
  const theme = useSiteTheme();
  const page = rest ? consolePages.find((item) => item.slug === rest)?.slug : 'overview';
  if (!page || (page === 'overview' && rest)) return <Navigate to={base} replace />;
  return (
    <Quarry
      page={page}
      base={base}
      navigate={(href) => navigate(href)}
      exitHref="/showcase"
      theme={theme}
      onThemeChange={setSiteTheme}
    />
  );
}
