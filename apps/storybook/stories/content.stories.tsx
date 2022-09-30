import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CarvedProvider,
  Surface,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Heading,
  Button,
  Badge,
  Avatar,
  Separator,
  Table,
  TableCaption,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@plurid/carved-ui-react';
const meta = { title: 'Content/Surfaces', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const NestedDepth: Story = {
  render: () => (
    <div className="lab-stack">
      <Surface className="lab-surface">
        Depth one
        <Surface className="lab-surface">
          Depth two
          <Surface className="lab-surface">
            Depth three
            <Surface className="lab-surface">
              Depth four
              <Surface className="lab-surface">
                Depth five<Surface className="lab-surface">Still depth five</Surface>
              </Surface>
            </Surface>
          </Surface>
        </Surface>
      </Surface>
    </div>
  ),
};
export const IndependentThemes: Story = {
  render: () => (
    <div className="lab-grid">
      {(['ponton', 'light', 'jaune', 'furor'] as const).map((theme) => (
        <CarvedProvider key={theme} theme={theme}>
          <Card>
            <CardHeader>
              <CardTitle>{theme}</CardTitle>
              <CardDescription>A complete isolated theme.</CardDescription>
            </CardHeader>
            <CardContent>Surface tokens follow this scope.</CardContent>
            <CardFooter>
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
            </CardFooter>
          </Card>
        </CarvedProvider>
      ))}
    </div>
  ),
};
export const CardComposition: Story = {
  render: () => (
    <Card className="lab-field">
      <CardHeader>
        <CardTitle>Carved UI</CardTitle>
        <CardDescription>Component library modernization.</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge tone="accent">In progress</Badge>
        <p>Tokens and components form a shared design language.</p>
      </CardContent>
      <CardFooter>
        <Button>Open project</Button>
        <Button variant="secondary">Share</Button>
      </CardFooter>
    </Card>
  ),
};
export const HeadingLevels: Story = {
  render: () => (
    <>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          Heading level {level}
        </Heading>
      ))}
    </>
  ),
};
export const Badges: Story = {
  render: () => (
    <div className="lab-row">
      <Badge>Draft</Badge>
      <Badge tone="accent">Published</Badge>
      <Badge tone="danger">Needs attention</Badge>
    </div>
  ),
};
export const Avatars: Story = {
  render: () => (
    <div className="lab-row">
      <Avatar name="Alex Morgan" size="sm" />
      <Avatar name="Sam Rivera" />
      <Avatar name="李 明" size="lg" />
      <Avatar name="Broken image fallback" src="data:image/png;base64,invalid" />
    </div>
  ),
};
export const SeparatorControl: Story = {
  render: () => (
    <div className="lab-field">
      <p>Project information</p>
      <Separator />
      <p>Team settings</p>
    </div>
  ),
};
export const NativeTable: Story = {
  render: () => (
    <div className="lab-table-scroll">
      <Table>
        <TableCaption>Example project activity</TableCaption>
        <TableHead>
          <TableRow>
            <TableHeader>Project</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Members</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Carved UI</TableCell>
            <TableCell>
              <Badge tone="accent">Active</Badge>
            </TableCell>
            <TableCell>12</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Documentation</TableCell>
            <TableCell>
              <Badge>Draft</Badge>
            </TableCell>
            <TableCell>4</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
