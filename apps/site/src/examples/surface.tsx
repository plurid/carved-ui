import { Surface } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Surface className="pad">
      Depth 1
      <Surface className="pad">
        Depth 2
        <Surface className="pad">
          Depth 3<Surface className="pad">Depth 4</Surface>
        </Surface>
      </Surface>
    </Surface>
  );
}
