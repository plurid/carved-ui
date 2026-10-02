import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, DropZone, FileTrigger } from '@plurid/carved-ui-react';

const meta = {
  title: 'Fields/Drop zone',
  component: DropZone,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DropZone>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Images: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div className="lab-stack">
        <DropZone
          label="Drop images here"
          description="PNG or JPEG, up to 10 MB each."
          acceptedFileTypes={['image/png', 'image/jpeg']}
          allowsMultiple
          onSelect={setFiles}
        />
        <ul aria-label="Chosen files">
          {files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
    await userEvent.upload(input, [
      new File(['png'], 'photo.png', { type: 'image/png' }),
      new File(['jpg'], 'portrait.jpg', { type: 'image/jpeg' }),
    ]);
    const list = canvas.getByRole('list', { name: 'Chosen files' });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    await expect(canvas.getByRole('button', { name: 'Choose files' })).toBeEnabled();
  },
};

export const Disabled: Story = {
  args: { isDisabled: true, label: 'Uploads are paused' },
};

export const OwnTrigger: Story = {
  render: () => {
    const [name, setName] = useState('');
    return (
      <div className="lab-row">
        <FileTrigger
          acceptedFileTypes={['.pdf']}
          onSelect={(files) => setName(files?.[0]?.name ?? '')}
        >
          <Button variant="secondary">Attach a PDF</Button>
        </FileTrigger>
        <output aria-label="Attached file">{name}</output>
      </div>
    );
  },
};
