import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Avatar,
  Badge,
  Button,
  GridList,
  GridListItem,
  Tag,
  TagGroup,
  Tree,
  TreeItem,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Collections/Lists and trees',
  component: GridList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="lab-narrow">{Story()}</div>],
} satisfies Meta<typeof GridList>;
export default meta;
type Story = StoryObj<typeof meta>;

const people = [
  { id: 'ana', name: 'Ana Pop', role: 'Owner' },
  { id: 'ioan', name: 'Ioan Marin', role: 'Editor' },
  { id: 'mara', name: 'Mara Ilie', role: 'Viewer' },
];

export const Members: Story = {
  render: () => (
    <GridList aria-label="Members" items={people} selectionMode="multiple">
      {(person) => (
        <GridListItem textValue={person.name}>
          <Avatar name={person.name} size="sm" />
          <span style={{ flex: 1 }}>{person.name}</span>
          <Badge>{person.role}</Badge>
          <Button variant="ghost" size="sm" aria-label={`Remove ${person.name}`}>
            Remove
          </Button>
        </GridListItem>
      )}
    </GridList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: /Ioan Marin/ }));
    await expect(canvas.getByRole('row', { name: /Ioan Marin/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const EmptyList: Story = {
  render: () => <GridList aria-label="Invitations" renderEmptyState={() => 'No invitations'} />,
};

export const Files: Story = {
  render: () => (
    <Tree aria-label="Files" selectionMode="single" defaultExpandedKeys={['src']}>
      <TreeItem id="src" title="src">
        <TreeItem id="components" title="components">
          <TreeItem id="button" title="button.tsx" />
        </TreeItem>
        <TreeItem id="main" title="main.tsx" />
      </TreeItem>
      <TreeItem id="readme" title="README.md" />
    </Tree>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const components = canvas.getByRole('row', { name: 'components' });
    await expect(components).toHaveAttribute('aria-expanded', 'false');
    components.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(components).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('row', { name: 'button.tsx' })).toBeVisible();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(canvas.getByRole('row', { name: 'button.tsx' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const ChecklistTree: Story = {
  render: () => (
    <Tree aria-label="Permissions" selectionMode="multiple" defaultExpandedKeys={['projects']}>
      <TreeItem id="projects" title="Projects">
        <TreeItem id="read" title="Read" />
        <TreeItem id="write" title="Write" />
      </TreeItem>
      <TreeItem id="billing" title="Billing" />
    </Tree>
  ),
};

export const Tags: Story = {
  render: () => {
    const [labels, setLabels] = useState(['Bug', 'Design', 'Documentation']);
    return (
      <div className="lab-stack">
        <TagGroup
          label="Labels"
          onRemove={(keys) => setLabels((all) => all.filter((label) => !keys.has(label)))}
          renderEmptyState={() => 'No labels'}
        >
          {labels.map((label) => (
            <Tag key={label} id={label}>
              {label}
            </Tag>
          ))}
        </TagGroup>
        <TagGroup label="Show" selectionMode="multiple" defaultSelectedKeys={['open']}>
          <Tag id="open">Open</Tag>
          <Tag id="closed">Closed</Tag>
        </TagGroup>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const labels = canvas.getByRole('grid', { name: 'Labels' });
    await userEvent.click(within(labels).getAllByRole('button', { name: /Remove/ })[0]!);
    await expect(within(labels).queryByRole('row', { name: 'Bug' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('row', { name: 'Closed' }));
    await expect(canvas.getByRole('row', { name: 'Closed' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};
