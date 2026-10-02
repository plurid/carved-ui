import { useState } from 'react';
import {
  AppShell,
  Avatar,
  Button,
  Heading,
  Meter,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Surface,
} from '@plurid/carved-ui-react';

const places = [
  { id: 'overview', label: 'Overview' },
  { id: 'deploys', label: 'Deploys', count: 3 },
  { id: 'domains', label: 'Domains' },
  { id: 'settings', label: 'Settings' },
];

export default function Example() {
  const [place, setPlace] = useState('deploys');
  const current = places.find((item) => item.id === place)!;
  return (
    // Shown inside this page, so the shell leaves the page's landmarks to it.
    <AppShell
      landmarks={false}
      collapse="sm"
      style={{ blockSize: '30rem' }}
      header={
        <>
          <strong style={{ flex: 1 }}>Quarry</strong>
          <Avatar name="Priya Nair" size="sm" />
        </>
      }
      sidebar={
        <Sidebar aria-label="Project">
          <SidebarSection>
            {places.map((item) => (
              // In an app, give each place an href: CarvedProvider's navigate routes it.
              <SidebarItem
                key={item.id}
                count={item.count}
                isCurrent={item.id === place}
                onPress={() => setPlace(item.id)}
              >
                {item.label}
              </SidebarItem>
            ))}
          </SidebarSection>
          <Meter label="Build minutes" value={72} />
        </Sidebar>
      }
    >
      <Surface className="pad stack">
        <Heading level={3}>{current.label}</Heading>
        <p>The content scrolls on its own, beside the sidebar and below the header.</p>
        <div className="row">
          <Button>Deploy</Button>
        </div>
      </Surface>
    </AppShell>
  );
}
