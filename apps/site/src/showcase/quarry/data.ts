import { between, NOW, people, pick, seeded } from '../shared/random';

export type Status = 'live' | 'building' | 'ready' | 'failed' | 'canceled';

export interface Deploy {
  id: number;
  commit: string;
  message: string;
  branch: string;
  author: string;
  region: string;
  environment: 'production' | 'preview';
  status: Status;
  /** When it started, in milliseconds since 1970 (UTC). */
  started: number;
  /** How long it took to build and roll out. */
  seconds: number;
}

export const statuses: {
  id: Status;
  name: string;
  tone: 'success' | 'accent' | 'danger' | 'neutral';
}[] = [
  { id: 'live', name: 'Live', tone: 'success' },
  { id: 'building', name: 'Building', tone: 'accent' },
  { id: 'ready', name: 'Ready', tone: 'neutral' },
  { id: 'failed', name: 'Failed', tone: 'danger' },
  { id: 'canceled', name: 'Canceled', tone: 'neutral' },
];

export const regions = [
  { id: 'fra', name: 'Frankfurt', p50: 18, p95: 41 },
  { id: 'iad', name: 'Virginia', p50: 22, p95: 58 },
  { id: 'gru', name: 'São Paulo', p50: 64, p95: 212 },
  { id: 'nrt', name: 'Tokyo', p50: 31, p95: 77 },
  { id: 'syd', name: 'Sydney', p50: 36, p95: 90 },
  { id: 'bom', name: 'Mumbai', p50: 29, p95: 69 },
];

export const projects = [
  { id: 'atlas', name: 'Atlas', seed: 11 },
  { id: 'basalt', name: 'Basalt', seed: 23 },
  { id: 'cinder', name: 'Cinder', seed: 37 },
];

const branches = ['main', 'main', 'main', 'release', 'docs', 'search', 'billing', 'onboarding'];
const changes = [
  'Speed up the search index',
  'Fix the date picker in Safari',
  'Add invoices to the billing page',
  'Update dependencies',
  'Tighten the content security policy',
  'Cache fonts for a year',
  'Translate onboarding into Japanese',
  'Retry failed webhooks',
  'Remove the legacy importer',
  'Show storage in the sidebar',
  'Shorten cold starts',
  'Log slow queries',
];

/**
 * Ten thousand deploys of a project over the last few months, newest first, the same every
 * time. The newest production deploy is live and the two newest are still building.
 */
export function createDeploys(seed: number, count = 10_000): Deploy[] {
  const random = seeded(seed);
  let at = NOW - between(random, 2, 9) * 60_000;
  let liveFound = false;
  return Array.from({ length: count }, (_, index) => {
    const branch = pick(random, branches);
    const environment = branch === 'main' || branch === 'release' ? 'production' : 'preview';
    const roll = random();
    let status: Status =
      index < 2 ? 'building' : roll < 0.06 ? 'failed' : roll < 0.08 ? 'canceled' : 'ready';
    if (status === 'ready' && environment === 'production' && !liveFound) {
      status = 'live';
      liveFound = true;
    }
    const deploy: Deploy = {
      id: count - index,
      commit: Math.floor(random() * 0xfffffff)
        .toString(16)
        .padStart(7, '0'),
      message: pick(random, changes),
      branch,
      author: pick(random, people),
      region: pick(random, regions).name,
      environment,
      status,
      started: at,
      seconds: status === 'building' ? 0 : between(random, 24, 190),
    };
    // Weekends are quiet.
    const weekday = new Date(at).getUTCDay();
    at -= between(random, 3, 22) * (weekday === 0 || weekday === 6 ? 5 : 1) * 60_000;
    return deploy;
  });
}

/** The day of a time, as `YYYY-MM-DD` in UTC. */
export const dayOf = (time: number) => new Date(time).toISOString().slice(0, 10);

/** Deploys per day for the last `days` days, oldest first, with how many failed. */
export function perDay(deploys: Deploy[], days = 14) {
  const totals = new Map<string, { total: number; failed: number }>();
  for (let back = days - 1; back >= 0; back--)
    totals.set(dayOf(NOW - back * 86_400_000), { total: 0, failed: 0 });
  for (const deploy of deploys) {
    const day = totals.get(dayOf(deploy.started));
    if (!day) continue;
    day.total++;
    if (deploy.status === 'failed') day.failed++;
  }
  return [...totals].map(([day, count]) => ({ day, ...count }));
}
