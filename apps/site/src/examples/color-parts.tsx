import { useState } from 'react';
import {
  ColorArea,
  ColorField,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorWheel,
  parseColor,
} from '@plurid/carved-ui-react';

export default function Example() {
  const [color, setColor] = useState(parseColor('hsb(205, 80%, 76%)'));
  return (
    <div className="row" style={{ alignItems: 'flex-start', gap: '2rem' }}>
      <div className="stack" style={{ inlineSize: '12rem' }}>
        <ColorArea value={color} onChange={setColor} xChannel="saturation" yChannel="brightness" />
        <ColorSlider value={color} onChange={setColor} channel="hue" />
        <ColorSlider value={color} onChange={setColor} channel="alpha" />
      </div>
      <ColorWheel value={color} onChange={setColor} />
      <div className="stack" style={{ inlineSize: '12rem' }}>
        <ColorField label="Hex" value={color} onChange={(next) => next && setColor(next)} />
        <ColorSwatchPicker value={color} onChange={setColor}>
          <ColorSwatchPickerItem color="#1380C3" />
          <ColorSwatchPickerItem color="#2E8B57" />
          <ColorSwatchPickerItem color="#C2410C" />
          <ColorSwatchPickerItem color="#7C3AED" />
        </ColorSwatchPicker>
        <ColorSwatch color={color} size="lg" />
      </div>
    </div>
  );
}
