import { useId } from 'react';
import {
  Alert,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Heading,
  Link,
  Meter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useLocale,
} from '@plurid/carved-ui-react';
import { useTimes } from '../shared/time';
import { perDay, regions, statuses } from './data';
import type { Deploy } from './data';

interface OverviewProps {
  deploys: Deploy[];
  /** Where the full list of deploys is. */
  deploysHref: string;
  onOpen: (deploy: Deploy) => void;
}

/**
 * Deploys per day as a row of carved slots, each holding an inlaid bead as tall as the day's
 * count. The chart is a picture of the table beside it, which is what assistive technology
 * reads.
 */
function DeploysChart({ deploys }: { deploys: Deploy[] }) {
  const { locale } = useLocale();
  const caption = useId();
  const days = perDay(deploys);
  const most = Math.max(...days.map((day) => day.total), 1);
  const label = new Intl.DateTimeFormat(locale, { timeZone: 'UTC', weekday: 'narrow' });
  const date = new Intl.DateTimeFormat(locale, { timeZone: 'UTC', month: 'short', day: 'numeric' });
  return (
    <figure className="quarry-chart" aria-labelledby={caption}>
      <figcaption id={caption} className="quarry-visually-hidden">
        Deploys per day for the last two weeks
      </figcaption>
      <div className="quarry-bars" aria-hidden="true">
        {days.map((day) => (
          <div key={day.day} className="quarry-bar">
            <div className="quarry-slot carved-carve">
              <div
                className="quarry-bead"
                style={{ '--_share': day.total / most } as React.CSSProperties}
              />
            </div>
            <span className="quarry-day">{label.format(Date.parse(day.day))}</span>
          </div>
        ))}
      </div>
      <table className="quarry-visually-hidden">
        <thead>
          <tr>
            <th>Day</th>
            <th>Deploys</th>
            <th>Failed</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.day}>
              <td>{date.format(Date.parse(day.day))}</td>
              <td>{day.total}</td>
              <td>{day.failed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** The project at a glance: usage, the last two weeks, the newest deploys and the regions. */
export function Overview({ deploys, deploysHref, onOpen }: OverviewProps) {
  const times = useTimes();
  const recent = deploys.slice(0, 6);
  const live = deploys.find((deploy) => deploy.status === 'live');
  return (
    <div className="quarry-page">
      <header className="quarry-page-head">
        <Heading level={1}>Overview</Heading>
        {live && (
          <p className="quarry-muted">
            Live: <code>{live.commit}</code> on {live.branch}, {times.ago(live.started)}
          </p>
        )}
      </header>

      <Alert tone="warning" title="Slower responses in São Paulo">
        The 95th percentile is at 212 ms, three times the usual. We are moving traffic to Virginia
        while the provider looks into it.
      </Alert>

      <div className="quarry-grid">
        <Card>
          <CardHeader>
            <CardTitle level={2}>Usage this month</CardTitle>
            <CardDescription>Team plan, renews on April 1.</CardDescription>
          </CardHeader>
          <CardContent>
            <Meter label="Build minutes" value={82} valueLabel="4,920 of 6,000" tone="warning" />
            <Meter label="Storage" value={62} valueLabel="62 of 100 GB" />
            <Meter label="Bandwidth" value={41} valueLabel="410 GB of 1 TB" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle level={2}>Deploys per day</CardTitle>
            <CardDescription>The last two weeks, all branches.</CardDescription>
          </CardHeader>
          <DeploysChart deploys={deploys} />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle level={2}>Latest deploys</CardTitle>
          </CardHeader>
          <ul className="quarry-recent">
            {recent.map((deploy) => {
              const status = statuses.find((item) => item.id === deploy.status)!;
              return (
                <li key={deploy.id}>
                  <Badge tone={status.tone}>{status.name}</Badge>
                  <Link className="quarry-recent-link" onPress={() => onOpen(deploy)}>
                    {deploy.message}
                  </Link>
                  <span className="quarry-muted">{times.ago(deploy.started)}</span>
                </li>
              );
            })}
          </ul>
          <Link href={deploysHref}>All deploys</Link>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle level={2}>Regions</CardTitle>
            <CardDescription>Response times over the last hour.</CardDescription>
          </CardHeader>
          <Table aria-label="Response times by region">
            <TableHead>
              <TableRow>
                <TableHeader>Region</TableHeader>
                <TableHeader className="quarry-number">Median</TableHeader>
                <TableHeader className="quarry-number">95th</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {regions.map((region) => (
                <TableRow key={region.id}>
                  <TableHeader scope="row">{region.name}</TableHeader>
                  <TableCell className="quarry-number">{region.p50} ms</TableCell>
                  <TableCell className="quarry-number">
                    {region.p95 > 150 ? (
                      <Badge tone="warning">{region.p95} ms</Badge>
                    ) : (
                      `${region.p95} ms`
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
