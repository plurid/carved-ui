import { SplitPane, SplitView, Surface } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <SplitView
      orientation="vertical"
      defaultSize={60}
      minSize={25}
      maxSize={80}
      collapsible
      handleLabel="Resize the preview"
      style={{ blockSize: '20rem' }}
    >
      <SplitPane>
        <Surface className="pad" style={{ blockSize: '100%' }}>
          Preview of the page you are editing.
        </Surface>
      </SplitPane>
      <SplitPane>
        <Surface className="pad" style={{ blockSize: '100%' }}>
          <code>build finished in 4.2 s</code>
        </Surface>
      </SplitPane>
    </SplitView>
  );
}
