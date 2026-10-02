import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  AppShell,
  Avatar,
  CarvedProvider,
  Heading,
  Meter,
  Sidebar,
  SidebarItem,
  SidebarSection,
  SplitPane,
  SplitView,
  Surface,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Layout/Shell and split view',
  component: SplitView,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SplitView>;
export default meta;
type Story = StoryObj<typeof meta>;

const panes = (
  <>
    <SplitPane>
      <Surface className="lab-pad" style={{ blockSize: '100%' }}>
        Folders
      </Surface>
    </SplitPane>
    <SplitPane>
      <Surface className="lab-pad" style={{ blockSize: '100%' }}>
        Files
      </Surface>
    </SplitPane>
  </>
);

export const SideBySide: Story = {
  args: { children: panes, defaultSize: 30, step: 5, style: { blockSize: '14rem' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getByRole('separator', { name: 'Resize' });
    await expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    await expect(handle).toHaveAttribute('aria-valuenow', '30');
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(handle).toHaveAttribute('aria-valuenow', '35');
    await userEvent.keyboard('{Home}');
    await expect(handle).toHaveAttribute('aria-valuenow', '10');
    await userEvent.keyboard('{End}');
    await expect(handle).toHaveAttribute('aria-valuenow', '90');
  },
};

export const StackedAndCollapsible: Story = {
  args: {
    children: panes,
    orientation: 'vertical',
    collapsible: true,
    defaultSize: 60,
    handleLabel: 'Resize the folders',
    style: { blockSize: '18rem' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getByRole('separator', { name: 'Resize the folders' });
    await expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    handle.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(handle).toHaveAttribute('aria-valuenow', '65');
    await userEvent.keyboard('{Enter}');
    await expect(handle).toHaveAttribute('aria-valuenow', '0');
    const pane = canvasElement.querySelector(
      `#${CSS.escape(handle.getAttribute('aria-controls')!)}`,
    );
    await expect(pane).toHaveAttribute('inert');
    await userEvent.keyboard('{Enter}');
    await expect(handle).toHaveAttribute('aria-valuenow', '65');
  },
};

export const RightToLeft: Story = {
  args: { children: panes, defaultSize: 40, style: { blockSize: '14rem' } },
  render: (args) => (
    <CarvedProvider locale="ar-EG">
      <SplitView {...args} />
    </CarvedProvider>
  ),
  play: async ({ canvasElement }) => {
    const handle = within(canvasElement).getByRole('separator');
    handle.focus();
    // The first pane is on the right: moving the handle left widens it.
    await userEvent.keyboard('{ArrowLeft}');
    await expect(handle).toHaveAttribute('aria-valuenow', '45');
  },
};

function Controlled() {
  const [size, setSize] = useState(25);
  return (
    <div className="lab-stack">
      <SplitView size={size} onSizeChange={setSize} style={{ blockSize: '12rem' }}>
        {panes}
      </SplitView>
      <output aria-label="Share">{Math.round(size)}%</output>
    </div>
  );
}

export const ControlledSize: Story = {
  args: { children: panes },
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('separator').focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect(canvas.getByLabelText('Share')).toHaveTextContent('35%');
  },
};

function Shell({ width }: { width: string }) {
  const [place, setPlace] = useState('inbox');
  const places = [
    { id: 'inbox', label: 'Inbox', count: 12 },
    { id: 'sent', label: 'Sent' },
    { id: 'archive', label: 'Archive' },
  ];
  return (
    <div style={{ inlineSize: width }}>
      <AppShell
        style={{ blockSize: '26rem' }}
        header={
          <>
            <Heading level={2} style={{ flex: 1, margin: 0 }}>
              Post
            </Heading>
            <Avatar name="Amara Okafor" size="sm" />
          </>
        }
        sidebar={
          <Sidebar aria-label="Mailboxes">
            <SidebarSection>
              {places.map((item) => (
                <SidebarItem
                  key={item.id}
                  count={item.count}
                  isCurrent={place === item.id}
                  onPress={() => setPlace(item.id)}
                >
                  {item.label}
                </SidebarItem>
              ))}
            </SidebarSection>
            <Meter label="Storage" value={62} />
          </Sidebar>
        }
      >
        <Surface className="lab-pad">
          <Heading level={1}>{places.find((item) => item.id === place)!.label}</Heading>
        </Surface>
      </AppShell>
    </div>
  );
}

export const WideShell: Story = {
  args: { children: null },
  render: () => <Shell width="60rem" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'Mailboxes' })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Open navigation' })).toBeNull();
    await userEvent.click(canvas.getByRole('link', { name: /Archive/ }));
    await expect(canvas.getByRole('link', { name: /Archive/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Archive');
    // The skip link moves focus past the header and navigation.
    const skip = canvas.getByRole('link', { name: 'Skip to content' });
    skip.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('main')).toHaveFocus();
  },
};

export const NarrowShell: Story = {
  args: { children: null },
  render: () => <Shell width="24rem" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const menu = canvas.getByRole('button', { name: 'Open navigation' });
    await expect(canvas.queryByRole('navigation', { name: 'Mailboxes' })).toBeNull();
    await userEvent.click(menu);
    const drawer = await body.findByRole('dialog', { name: 'Navigation' });
    await userEvent.click(within(drawer).getByRole('link', { name: /Sent/ }));
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Sent');
    await waitFor(() => expect(menu).toHaveFocus());
  },
};
