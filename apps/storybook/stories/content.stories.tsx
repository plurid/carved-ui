import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Heading,
  Kbd,
  Separator,
  Surface,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Content/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Composition: Story = {
  render: () => (
    <Card style={{ maxInlineSize: '24rem' }}>
      <CardHeader>
        <CardTitle>Quarry</CardTitle>
        <CardDescription>Deploys from main · Frankfurt</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0 }}>Twelve deploys this week. The last one finished in 48 seconds.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Open</Button>
        <Button size="sm" variant="ghost">
          Settings
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ExplicitDepth: Story = {
  render: () => (
    <div className="lab-row">
      {([1, 2, 3, 4, 5] as const).map((depth) => (
        <Surface key={depth} depth={depth} className="lab-plate">
          {depth}
        </Surface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const surfaces = canvasElement.querySelectorAll('.carved-surface');
    await expect(surfaces[surfaces.length - 1]).toHaveAttribute('data-carved-depth', '5');
  },
};

export const Headings: Story = {
  render: () => (
    <div className="lab-stack">
      <Heading level={1} variant="engraved">
        Engraved
      </Heading>
      <Heading level={2} variant="display">
        Display headline
      </Heading>
      <Heading level={1}>Heading level one</Heading>
      <Heading level={2}>Heading level two</Heading>
      <Heading level={3}>Heading level three</Heading>
      <Heading level={4}>Heading level four</Heading>
      <Heading level={5}>Heading level five</Heading>
      <Heading level={6}>Heading level six</Heading>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('heading', { level: 1 })).toHaveLength(2);
  },
};

export const Separators: Story = {
  render: () => (
    <div className="lab-stack">
      <p style={{ margin: 0 }}>A fine carved line divides related content.</p>
      <Separator />
      <p style={{ margin: 0 }}>A trench divides regions.</p>
      <Separator variant="trench" />
      <div className="lab-row" style={{ blockSize: '2.5rem' }}>
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
};

export const BadgesAndAvatars: Story = {
  render: () => (
    <div className="lab-stack">
      <div className="lab-row">
        <Badge>Draft</Badge>
        <Badge tone="accent">New</Badge>
        <Badge tone="success">Live</Badge>
        <Badge tone="warning">Degraded</Badge>
        <Badge tone="danger">Failed</Badge>
      </div>
      <div className="lab-row">
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Alan Turing" size="lg" />
        <Avatar
          name="Margaret Hamilton"
          size="lg"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23b0773a'/%3E%3Ccircle cx='32' cy='26' r='12' fill='%23f3d9b8'/%3E%3Cpath d='M10 64c2-14 12-20 22-20s20 6 22 20z' fill='%23f3d9b8'/%3E%3C/svg%3E"
        />
        <Avatar name="Broken Image" src="data:image/png;base64,broken" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', { name: 'Grace Hopper' }),
    ).toHaveTextContent('GH');
  },
};

const deploys = [
  { id: 'a41f', branch: 'main', region: 'Frankfurt', duration: '48 s', status: 'Live' },
  { id: '9c02', branch: 'main', region: 'Virginia', duration: '52 s', status: 'Live' },
  { id: '77e1', branch: 'fix/cache', region: 'Frankfurt', duration: '1 min 3 s', status: 'Failed' },
];

export const NativeTable: Story = {
  render: () => (
    <Table>
      <TableCaption>Deploys this week</TableCaption>
      <TableHead>
        <TableRow>
          <TableHeader>Commit</TableHeader>
          <TableHeader>Branch</TableHeader>
          <TableHeader>Region</TableHeader>
          <TableHeader>Duration</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {deploys.map((deploy) => (
          <TableRow key={deploy.id}>
            <TableHeader scope="row">{deploy.id}</TableHeader>
            <TableCell>{deploy.branch}</TableCell>
            <TableCell>{deploy.region}</TableCell>
            <TableCell>{deploy.duration}</TableCell>
            <TableCell>
              <Badge tone={deploy.status === 'Live' ? 'success' : 'danger'}>{deploy.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('table', { name: 'Deploys this week' }),
    ).toBeVisible();
  },
};

export const Keys: Story = {
  render: () => (
    <p>
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, or <Kbd>Esc</Kbd> to close.
    </p>
  ),
};

export const People: Story = {
  render: () => (
    <AvatarGroup aria-label="Project members" max={3}>
      <Avatar name="Amara Okafor" />
      <Avatar name="Kenji Sato" />
      <Avatar name="Lena Fischer" />
      <Avatar name="Mateo García" />
      <Avatar name="Priya Nair" />
    </AvatarGroup>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: 'Project members' });
    await expect(within(group).getAllByRole('img')).toHaveLength(4);
    await expect(within(group).getByRole('img', { name: '2 more' })).toBeVisible();
  },
};
