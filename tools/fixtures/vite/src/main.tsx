import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { CarvedProvider } from '@plurid/carved-ui-react/provider';
import { Button } from '@plurid/carved-ui-react/button';
import { createTheme } from '@plurid/carved-ui-core';
import '@plurid/carved-ui-react/styles.css';
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
