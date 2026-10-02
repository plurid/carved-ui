import { useMemo, useState, useSyncExternalStore } from 'react';
import type { ThemePreset } from '@plurid/carved-ui-core';
import {
  AlertDialog,
  AppShell,
  Avatar,
  Badge,
  Button,
  CommandItem,
  CommandPalette,
  CommandSection,
  Dialog,
  DialogFooter,
  DialogTrigger,
  Drawer,
  Kbd,
  Modal,
  Select,
  SelectItem,
  Sidebar,
  SidebarItem,
  SidebarSection,
  ToastQueue,
  ToastRegion,
} from '@plurid/carved-ui-react';
import { ThemeMenu } from '../shared/theme-menu';
import { GaugeIcon, GridIcon, RocketIcon, SearchIcon, SettingsIcon } from '../shared/icons';
import { useTimes } from '../shared/time';
import { createDeploys, projects, statuses } from './data';
import type { Deploy } from './data';
import { Deploys } from './deploys';
import { Overview } from './overview';
import { consolePages } from './places';
import type { ConsolePage } from './places';
import { Settings } from './settings';

export interface QuarryProps {
  page: ConsolePage;
  /** The path the app is served at: pages are its subpaths. */
  base: string;
  /** Goes to a path, through the host's router. */
  navigate: (href: string) => void;
  /** Where "All apps" goes. */
  exitHref: string;
  theme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
}

const toasts = new ToastQueue({ maxVisibleToasts: 3 });
const icons = { overview: GaugeIcon, deploys: RocketIcon, settings: SettingsIcon };

const unchanging = () => () => {};
/** ⌘K on Apple platforms, Ctrl K elsewhere; nothing on the server, which cannot tell. */
function useShortcut() {
  const apple = useSyncExternalStore(
    unchanging,
    () => /mac|iphone|ipad/i.test(navigator.platform),
    () => null,
  );
  if (apple === null) return null;
  return apple ? { label: '⌘K', keys: 'Meta+K' } : { label: 'Ctrl K', keys: 'Control+K' };
}

/** A deploy's details in a drawer, with a way to roll back to it. */
function DeployDrawer({
  deploy,
  onClose,
  onRollback,
}: {
  deploy: Deploy | null;
  onClose: () => void;
  onRollback: (deploy: Deploy) => void;
}) {
  const times = useTimes();
  if (!deploy) return null;
  const status = statuses.find((item) => item.id === deploy.status)!;
  const facts: [string, string][] = [
    ['Commit', deploy.commit],
    ['Branch', deploy.branch],
    ['Environment', deploy.environment === 'production' ? 'Production' : 'Preview'],
    ['Author', deploy.author],
    ['Region', deploy.region],
    ['Started', times.full(deploy.started)],
    ['Took', deploy.seconds ? `${deploy.seconds} seconds` : 'Still building'],
  ];
  return (
    <Drawer isOpen onOpenChange={(open) => !open && onClose()} isDismissable>
      <Dialog title={`Deploy #${deploy.id}`} className="quarry-drawer">
        <div className="quarry-drawer-status">
          <Badge tone={status.tone}>{status.name}</Badge>
          <span>{deploy.message}</span>
        </div>
        <dl className="quarry-facts">
          {facts.map(([term, value]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <pre className="quarry-log carved-carve" tabIndex={0} aria-label="Build log">
          {[
            `› Cloning ${deploy.branch} at ${deploy.commit}`,
            '› Installing dependencies',
            '› Building for production',
            deploy.status === 'failed'
              ? '✕ Build failed: type error in src/search/index.ts'
              : deploy.status === 'building'
                ? '› Optimising images…'
                : `✓ Built in ${Math.round(deploy.seconds * 0.7)} s`,
            ...(deploy.status === 'failed' || deploy.status === 'building'
              ? []
              : [`› Rolling out to ${deploy.region}`, '✓ Ready']),
          ].join('\n')}
        </pre>
        <DialogFooter>
          <Button variant="ghost" slot="close">
            Close
          </Button>
          {(deploy.status === 'ready' || deploy.status === 'live') && (
            <DialogTrigger>
              <Button variant="secondary" isDisabled={deploy.status === 'live'}>
                {deploy.status === 'live' ? 'Live now' : 'Roll back to this deploy'}
              </Button>
              <Modal size="sm">
                <AlertDialog
                  tone="accent"
                  title={`Roll back to #${deploy.id}?`}
                  actionLabel="Roll back"
                  onAction={async () => {
                    await new Promise((done) => setTimeout(done, 800));
                    onRollback(deploy);
                  }}
                >
                  Visitors get this deploy within a minute. The current one stays, so you can roll
                  forward again.
                </AlertDialog>
              </Modal>
            </DialogTrigger>
          )}
        </DialogFooter>
      </Dialog>
    </Drawer>
  );
}

/**
 * Quarry, a deploy console: a project's usage and recent deploys, every deploy in one table,
 * its settings, and a command palette to reach any of them.
 */
export function Quarry({ page, base, navigate, exitHref, theme, onThemeChange }: QuarryProps) {
  const [project, setProject] = useState(projects[0]!.id);
  const seed = projects.find((item) => item.id === project)!;
  const generated = useMemo(() => createDeploys(seed.seed), [seed]);
  // Rollbacks change which deploy is live; kept per project.
  const [liveIds, setLiveIds] = useState<Record<string, number>>({});
  const deploys = useMemo(() => {
    const live = liveIds[project];
    if (live === undefined) return generated;
    return generated.map((deploy) =>
      deploy.id === live
        ? { ...deploy, status: 'live' as const }
        : deploy.status === 'live'
          ? { ...deploy, status: 'ready' as const }
          : deploy,
    );
  }, [generated, liveIds, project]);
  const [open, setOpen] = useState<Deploy | null>(null);
  const shortcut = useShortcut();
  const hrefOf = (slug: ConsolePage) => (slug === 'overview' ? base : `${base}/${slug}`);

  const rollback = (deploy: Deploy) => {
    setLiveIds((all) => ({ ...all, [project]: deploy.id }));
    setOpen(null);
    toasts.add(
      { title: `Rolled back to #${deploy.id}`, description: deploy.message, tone: 'success' },
      { timeout: 5000 },
    );
  };

  return (
    <>
      <AppShell
        className="quarry"
        header={
          <>
            <span className="quarry-brand carved-engrave">Quarry</span>
            <Select
              aria-label="Project"
              selectedKey={project}
              onSelectionChange={(key) => key && setProject(String(key))}
              className="quarry-project"
            >
              {projects.map((item) => (
                <SelectItem key={item.id} id={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </Select>
            <span className="quarry-spacer" />
            <DialogTrigger>
              <Button variant="secondary" size="sm" aria-keyshortcuts={shortcut?.keys}>
                <SearchIcon />
                <span className="quarry-goto-label">Go to…</span>
                {shortcut && (
                  <Kbd aria-hidden="true" className="quarry-goto-keys">
                    {shortcut.label}
                  </Kbd>
                )}
              </Button>
              <CommandPalette
                onAction={(key) => {
                  const target = String(key);
                  if (target.startsWith('page:')) navigate(hrefOf(target.slice(5) as ConsolePage));
                  else if (target.startsWith('project:')) setProject(target.slice(8));
                  else if (target === 'latest') setOpen(deploys[0] ?? null);
                  else if (target === 'deploy')
                    toasts.add(
                      { title: 'Deploying main', description: `${seed.name}, to production` },
                      { timeout: 4000 },
                    );
                }}
              >
                <CommandSection title="Go to">
                  {consolePages.map((item) => (
                    <CommandItem key={item.slug} id={`page:${item.slug}`}>
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandSection>
                <CommandSection title="Projects">
                  {projects.map((item) => (
                    <CommandItem key={item.id} id={`project:${item.id}`}>
                      {`Switch to ${item.name}`}
                    </CommandItem>
                  ))}
                </CommandSection>
                <CommandSection title="Actions">
                  <CommandItem id="deploy">Deploy main</CommandItem>
                  <CommandItem id="latest">Open the latest deploy</CommandItem>
                </CommandSection>
              </CommandPalette>
            </DialogTrigger>
            <ThemeMenu theme={theme} onThemeChange={onThemeChange} />
            <Avatar name="Priya Nair" size="sm" />
          </>
        }
        sidebar={
          <Sidebar aria-label="Project">
            <SidebarSection>
              {consolePages.map((item) => {
                const Icon = icons[item.slug];
                return (
                  <SidebarItem
                    key={item.slug}
                    href={hrefOf(item.slug)}
                    icon={<Icon />}
                    isCurrent={page === item.slug}
                    count={
                      item.slug === 'deploys'
                        ? deploys.filter((deploy) => deploy.status === 'building').length ||
                          undefined
                        : undefined
                    }
                  >
                    {item.name}
                  </SidebarItem>
                );
              })}
            </SidebarSection>
            <SidebarSection className="quarry-exit">
              <SidebarItem href={exitHref} icon={<GridIcon />}>
                All apps
              </SidebarItem>
            </SidebarSection>
          </Sidebar>
        }
      >
        {page === 'overview' && (
          <Overview deploys={deploys} deploysHref={hrefOf('deploys')} onOpen={setOpen} />
        )}
        {page === 'deploys' && <Deploys deploys={deploys} onOpen={setOpen} />}
        {page === 'settings' && (
          <Settings
            project={seed.name}
            onSaved={() =>
              toasts.add({ title: 'Settings saved', tone: 'success' }, { timeout: 4000 })
            }
            onDeleted={() =>
              toasts.add(
                {
                  title: `${seed.name} is safe`,
                  description: 'This is a showcase: nothing was deleted.',
                },
                { timeout: 5000 },
              )
            }
          />
        )}
      </AppShell>
      <DeployDrawer deploy={open} onClose={() => setOpen(null)} onRollback={rollback} />
      <ToastRegion queue={toasts} />
    </>
  );
}
