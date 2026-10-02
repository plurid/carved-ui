import { useState } from 'react';
import { Tag, TagGroup } from '@plurid/carved-ui-react';
import type { Key, Selection } from '@plurid/carved-ui-react';

export default function Example() {
  const [labels, setLabels] = useState([
    { id: 'bug', name: 'Bug' },
    { id: 'design', name: 'Design' },
    { id: 'docs', name: 'Documentation' },
    { id: 'perf', name: 'Performance' },
  ]);
  const [filters, setFilters] = useState<Selection>(new Set(['open']));
  const remove = (keys: Set<Key>) => setLabels((all) => all.filter((tag) => !keys.has(tag.id)));
  return (
    <div className="stack">
      <TagGroup
        label="Labels"
        items={labels}
        onRemove={remove}
        renderEmptyState={() => 'No labels'}
        description="Remove a label with its button, or Delete."
      >
        {(tag) => <Tag>{tag.name}</Tag>}
      </TagGroup>
      <TagGroup
        label="Show"
        selectionMode="multiple"
        selectedKeys={filters}
        onSelectionChange={setFilters}
      >
        <Tag id="open">Open</Tag>
        <Tag id="review">In review</Tag>
        <Tag id="closed">Closed</Tag>
      </TagGroup>
    </div>
  );
}
