import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorWheel,
  parseColor,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Fields/Colour',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="lab-tall">{Story()}</div>],
} satisfies Meta<typeof ColorPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Picker: Story = {
  render: () => {
    const [color, setColor] = useState(parseColor('#1380C3'));
    return (
      <div className="lab-row">
        <ColorPicker
          label="Accent"
          value={color}
          onChange={setColor}
          swatches={['#1380C3', '#2E8B57', '#C2410C', '#7C3AED']}
        />
        <output aria-label="Chosen colour">{color.toString('hex')}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Accent/ }));
    const body = within(canvasElement.ownerDocument.body);
    const hex = await body.findByRole('textbox', { name: 'Hex' });
    await userEvent.clear(hex);
    await userEvent.type(hex, '#2E8B57{Enter}');
    await expect(canvas.getByLabelText('Chosen colour')).toHaveTextContent('#2E8B57');
    await userEvent.click(body.getAllByRole('option')[3]!);
    await expect(canvas.getByLabelText('Chosen colour')).toHaveTextContent('#7C3AED');
  },
};

export const Parts: Story = {
  render: () => {
    const [color, setColor] = useState(parseColor('hsb(205, 80%, 76%)'));
    return (
      <div className="lab-row" style={{ alignItems: 'flex-start' }}>
        <div className="lab-stack" style={{ inlineSize: '12rem' }}>
          <ColorArea
            value={color}
            onChange={setColor}
            xChannel="saturation"
            yChannel="brightness"
          />
          <ColorSlider value={color} onChange={setColor} channel="hue" />
          <ColorSlider value={color} onChange={setColor} channel="alpha" />
        </div>
        <ColorWheel value={color} onChange={setColor} />
        <div className="lab-stack" style={{ inlineSize: '12rem' }}>
          <ColorField label="Hex" value={color} onChange={(next) => next && setColor(next)} />
          <ColorSwatchPicker value={color} onChange={setColor}>
            <ColorSwatchPickerItem color="#1380C3" />
            <ColorSwatchPickerItem color="#2E8B57" />
            <ColorSwatchPickerItem color="#C2410C" />
          </ColorSwatchPicker>
          <ColorSwatch color={color} size="lg" />
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The hue slider and the wheel edit the same channel.
    const [slider, wheel] = canvas.getAllByRole('slider', { name: 'Hue' });
    slider!.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveValue('206');
    await expect(wheel).toHaveValue('206');
  },
};
