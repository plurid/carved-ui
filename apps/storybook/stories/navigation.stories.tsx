import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionPanel,
  Button,
  Breadcrumbs,
  Breadcrumb,
  Link,
  Pagination,
  PaginationLink,
} from '@plurid/carved-ui-react';
const meta = { title: 'Navigation/Controls', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const TabControl: Story = {
  render: () => (
    <Tabs>
      <TabList aria-label="Project">
        <Tab id="overview">Overview</Tab>
        <Tab id="activity">Activity</Tab>
        <Tab id="settings" isDisabled>
          Settings
        </Tab>
      </TabList>
      <TabPanel id="overview">Project overview content.</TabPanel>
      <TabPanel id="activity">Recent project activity.</TabPanel>
      <TabPanel id="settings">Project settings.</TabPanel>
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
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Recent project activity.');
  },
};
export const AccordionControl: Story = {
  render: () => (
    <Accordion className="lab-field">
      <AccordionItem id="access">
        <h3>
          <Button slot="trigger" variant="ghost">
            Who can access this project?
          </Button>
        </h3>
        <AccordionPanel>Only the people you invite can access a private project.</AccordionPanel>
      </AccordionItem>
      <AccordionItem id="export">
        <h3>
          <Button slot="trigger" variant="ghost">
            Can I export the project?
          </Button>
        </h3>
        <AccordionPanel>You can export project data from settings.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Who can access this project?' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByText('Only the people you invite can access a private project.'),
    ).toBeVisible();
  },
};
export const BreadcrumbControl: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumb>
        <Link href="#home">Home</Link>
      </Breadcrumb>
      <Breadcrumb>
        <Link href="#projects">Projects</Link>
      </Breadcrumb>
      <Breadcrumb>
        <Link>Carved UI</Link>
      </Breadcrumb>
    </Breadcrumbs>
  ),
};
export const PaginationControl: Story = {
  render: () => (
    <Pagination>
      <PaginationLink href="?page=1" aria-label="Page 1">
        1
      </PaginationLink>
      <PaginationLink href="?page=2" aria-label="Page 2" current>
        2
      </PaginationLink>
      <PaginationLink href="?page=3" aria-label="Page 3">
        3
      </PaginationLink>
      <PaginationLink href="?page=3" aria-label="Next page">
        Next
      </PaginationLink>
    </Pagination>
  ),
};
