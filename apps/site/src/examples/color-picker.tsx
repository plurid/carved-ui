import { useState } from 'react';
import { ColorPicker, parseColor } from '@plurid/carved-ui-react';

export default function Example() {
  const [color, setColor] = useState(parseColor('#1380C3'));
  return (
    <div className="row">
      <ColorPicker
        label="Accent"
        value={color}
        onChange={setColor}
        swatches={['#1380C3', '#2E8B57', '#C2410C', '#B91C1C', '#7C3AED', '#334155']}
      />
      <code>{color.toString('hex')}</code>
    </div>
  );
}
