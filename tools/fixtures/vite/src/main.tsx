import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { Button, CarvedProvider } from '@plurid/carved-ui-react';
import { createTheme } from '@plurid/carved-ui-core';
import '@plurid/carved-ui-react/styles.css';

// Imports only a button from the package root: everything else must tree-shake away.
function App() {
  const [count, setCount] = useState(0);
  return (
    <CarvedProvider theme={createTheme({ color: '#284c42' })}>
      <main>
        <h1>Vite consumer</h1>
        <Button onPress={() => setCount((value) => value + 1)}>Count {count}</Button>
      </main>
    </CarvedProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
