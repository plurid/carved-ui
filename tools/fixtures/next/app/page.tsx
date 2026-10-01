import { Alert, Heading } from '@plurid/carved-ui-react';
import { createTheme } from '@plurid/carved-ui-core';
import { Consumer } from './consumer';

// A server component: static content renders on the server, controls hydrate on the client.
export default function Page() {
  return (
    <main>
      <Heading level={1}>Next server component</Heading>
      <Alert tone="success">Rendered on the server</Alert>
      <Consumer theme={createTheme({ color: '#284c42' })} />
    </main>
  );
}
