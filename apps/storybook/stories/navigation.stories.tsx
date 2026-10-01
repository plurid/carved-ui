import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Accordion,
  Breadcrumb,
  Breadcrumbs,
  Disclosure,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs>
      <TabList aria-label="Project">
        <Tab id="overview">Overview</Tab>
        <Tab id="activity">Activity</Tab>
        <Tab id="settings">Settings</Tab>
        <Tab id="billing" isDisabled>
          Billing
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="overview">Quarry was created in March and deploys from main.</TabPanel>
        <TabPanel id="activity">Twelve deploys this week, none failed.</TabPanel>
        <TabPanel id="settings">Settings live in the project&apos;s repository.</TabPanel>
      </TabPanels>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Twelve deploys');
  },
};

export const Vertical: Story = {
  render: () => (
    <Tabs orientation="vertical">
      <TabList aria-label="Settings">
        <Tab id="general">General</Tab>
        <Tab id="members">Members</Tab>
        <Tab id="security">Security</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="general">Name, avatar and default branch.</TabPanel>
        <TabPanel id="members">Invite people and set their roles.</TabPanel>
        <TabPanel id="security">Keys, tokens and audit history.</TabPanel>
      </TabPanels>
    </Tabs>
  ),
};

export const AccordionGroup: Story = {
  render: () => (
    <div className="lab-stack">
      <Accordion defaultExpandedKeys={['shipping']}>
        <Disclosure id="shipping" title="How are deploys triggered?">
          <p>Every push to main deploys after the checks pass.</p>
        </Disclosure>
        <Disclosure id="rollback" title="Can I roll back?">
          <p>Yes. Any previous deploy can be promoted again in one click.</p>
        </Disclosure>
        <Disclosure id="limits" title="Are there limits?" isDisabled>
          <p>Not on the team plan.</p>
        </Disclosure>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rollback = canvas.getByRole('button', { name: 'Can I roll back?' });
    await userEvent.click(rollback);
    await expect(rollback).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByRole('button', { name: 'How are deploys triggered?' }),
    ).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Trail: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="#workspace">Workspace</Breadcrumb>
      <Breadcrumb href="#projects">Projects</Breadcrumb>
      <Breadcrumb>Quarry</Breadcrumb>
    </Breadcrumbs>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Quarry').closest('[aria-current]'),
    ).toHaveAttribute('aria-current', 'page');
  },
};
