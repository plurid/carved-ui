import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Pagination } from '@plurid/carved-ui-react';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { page: 1, pageCount: 1 },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Pages: Story = {
  decorators: [(Story) => <div style={{ inlineSize: 'max-content' }}>{Story()}</div>],
  render: () => {
    const [page, setPage] = useState(6);
    return (
      <div className="lab-stack">
        <Pagination aria-label="Search results" page={page} pageCount={24} onPageChange={setPage} />
        <Pagination
          aria-label="Archive"
          page={2}
          pageCount={4}
          href={(number) => `#page-${number}`}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [buttons, links] = canvas.getAllByRole('navigation');
    const pages = within(buttons!);
    await expect(pages.getByRole('button', { name: 'Page 6' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await userEvent.click(pages.getByRole('button', { name: 'Next page' }));
    await expect(pages.getByRole('button', { name: 'Page 7' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await userEvent.click(pages.getByRole('button', { name: 'Page 24' }));
    await expect(pages.getByRole('button', { name: 'Next page' })).toBeDisabled();
    await expect(within(links!).getByRole('link', { name: 'Page 3' })).toHaveAttribute(
      'href',
      '#page-3',
    );
  },
};
