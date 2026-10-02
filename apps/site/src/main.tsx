import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/jetbrains-mono';
import '@plurid/carved-ui-react/styles.css';
import '../../../docs/examples/recipes.css';
import './site.css';
import { App, basename } from './app';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
// Prerendered pages are hydrated. In development the root holds only the `<!--app-->`
// placeholder, so the app renders from scratch.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
