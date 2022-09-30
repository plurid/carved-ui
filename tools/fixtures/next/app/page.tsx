import { Heading } from '@plurid/carved-ui-react/content';
import { createTheme } from '@plurid/carved-ui-core';
import { Consumer } from './consumer';
export default function Page() {
  return (
    <main>
      <Heading level={1}>Next server component</Heading>
      <Consumer theme={createTheme({ color: '#284c42' })} />
    </main>
  );
}
