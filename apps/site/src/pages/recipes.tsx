import { Heading } from '@plurid/carved-ui-react';
import { Specimen } from '../components/specimen';
import * as settings from '../examples/recipes/settings.tsx?example';
import * as confirm from '../examples/recipes/confirm.tsx?example';
import * as search from '../examples/recipes/search.tsx?example';
import * as shell from '../examples/recipes/shell.tsx?example';

export function Recipes() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Patterns</p>
        <Heading level={1}>Recipes</Heading>
        <p className="page-lede">
          Patterns every application shapes differently, so they are not packaged. Copy one into
          your project from <code>docs/examples</code>, then wire it to your data and make it yours.
        </p>
      </header>
      <div className="specimens">
        <Specimen
          title="Settings form"
          description="Native validation, a pending save, an announced status and a retryable error."
          module={settings}
        />
        <Specimen
          title="Confirm a destructive action"
          description="The dialog stays open while the request runs and reports a failure in place."
          module={confirm}
        />
        <Specimen
          title="Searchable table"
          description="A native table filtered by a search field, with a result count and an empty state."
          module={search}
        />
        <Specimen
          title="Page frame"
          description="Navigation, a trail and a heading around the content."
          module={shell}
        />
      </div>
    </div>
  );
}
