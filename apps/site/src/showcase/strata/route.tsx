import { Navigate, useNavigate, useParams } from 'react-router';
import { setSiteTheme, useSiteTheme } from '../../theme';
import { drivePlaces } from './places';
import { Strata } from './strata';

const base = '/showcase/files';

/**
 * The site's way into Strata: it reads the place from the path and hands the app the site's
 * router and theme. Strata itself knows nothing of the site.
 */
export function StrataRoute() {
  const rest = useParams()['*'] ?? '';
  const navigate = useNavigate();
  const theme = useSiteTheme();
  const place = rest ? drivePlaces.find((item) => item.slug === rest)?.slug : 'files';
  if (!place || (place === 'files' && rest)) return <Navigate to={base} replace />;
  return (
    <Strata
      place={place}
      base={base}
      navigate={(href) => navigate(href)}
      exitHref="/showcase"
      theme={theme}
      onThemeChange={setSiteTheme}
    />
  );
}
