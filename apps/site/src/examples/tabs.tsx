import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Tabs>
      <TabList aria-label="Project">
        <Tab id="overview">Overview</Tab>
        <Tab id="activity">Activity</Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="overview">Quarry deploys from main to two regions.</TabPanel>
        <TabPanel id="activity">Twelve deploys this week, none failed.</TabPanel>
        <TabPanel id="settings">Settings live in the repository.</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
