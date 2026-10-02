import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Autocomplete,
  Avatar,
  Button,
  GridList,
  GridListItem,
  ListBox,
  ListBoxItem,
  MenuItem,
  MenuList,
  MenuTrigger,
  Popover,
  SearchField,
  Surface,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Collections/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="lab-narrow">{Story()}</div>],
} satisfies Meta<typeof Autocomplete>;
export default meta;
type Story = StoryObj<typeof meta>;

const people = [
  'Amara Okafor',
  'Kenji Sato',
  'Lena Fischer',
  'Mateo García',
  'Priya Nair',
  'Sofia Rossi',
  'Émile Dubois',
  'Zhang Wei',
].map((name) => ({ id: name, name }));

export const FilterAList: Story = {
  args: { children: null },
  render: () => (
    <Surface className="lab-stack lab-pad">
      <Autocomplete>
        <SearchField label="Invite" placeholder="Search people" />
        <ListBox
          aria-label="People"
          items={people}
          selectionMode="multiple"
          renderEmptyState={() => 'Nobody by that name.'}
        >
          {(person) => <ListBoxItem>{person.name}</ListBoxItem>}
        </ListBox>
      </Autocomplete>
    </Surface>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Matching ignores case and accents.
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Invite' }), 'emile');
    await waitFor(() => expect(canvas.getAllByRole('option')).toHaveLength(1));
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(canvas.getByRole('option', { name: 'Émile Dubois' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.clear(canvas.getByRole('searchbox'));
    await userEvent.type(canvas.getByRole('searchbox'), 'zzz');
    await expect(await canvas.findByText('Nobody by that name.')).toBeVisible();
  },
};

export const FilterAGridList: Story = {
  args: { children: null },
  render: () => (
    <div className="lab-stack">
      <Autocomplete filter="startsWith">
        <SearchField aria-label="Find a member" placeholder="Find a member" />
        <GridList aria-label="Members" items={people}>
          {(person) => (
            <GridListItem textValue={person.name}>
              <Avatar name={person.name} size="sm" />
              {person.name}
            </GridListItem>
          )}
        </GridList>
      </Autocomplete>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('searchbox'), 'pr');
    await waitFor(() => expect(canvas.getAllByRole('row')).toHaveLength(1));
    // A grid list is reached with Tab, not with the arrow keys from the field.
    await userEvent.tab();
    await expect(canvas.getByRole('row', { name: 'Priya Nair' })).toHaveFocus();
  },
};

const labels = ['Bug', 'Design', 'Documentation', 'Good first issue', 'Performance', 'Security'];

export const SearchableMenu: Story = {
  args: { children: null },
  render: () => (
    <MenuTrigger>
      <Button variant="secondary">Labels</Button>
      <Popover placement="bottom start">
        <Autocomplete>
          <SearchField aria-label="Filter labels" placeholder="Filter labels" autoFocus />
          <MenuList aria-label="Labels" selectionMode="multiple">
            {labels.map((label) => (
              <MenuItem key={label} id={label}>
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </Autocomplete>
      </Popover>
    </MenuTrigger>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Labels' }));
    const body = within(canvasElement.ownerDocument.body);
    const search = await body.findByRole('searchbox', { name: 'Filter labels' });
    await waitFor(() => expect(search).toHaveFocus());
    await userEvent.keyboard('doc');
    await waitFor(() => expect(body.getAllByRole('menuitemcheckbox')).toHaveLength(1));
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(body.getByRole('menuitemcheckbox', { name: 'Documentation' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  },
};
