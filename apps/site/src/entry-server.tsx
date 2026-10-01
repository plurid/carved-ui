import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { App, basename } from './app';

export { paths, titleFor } from './routes';

/** Render a page to HTML once every lazy part of it has loaded. */
export async function render(path: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter location={`${basename}${path}`} basename={basename}>
      <App />
    </StaticRouter>,
  );
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return html;
}
