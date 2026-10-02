import { Tree, TreeItem } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Tree
      aria-label="Files"
      selectionMode="single"
      defaultExpandedKeys={['src', 'components', 'styles']}
      defaultSelectedKeys={['button']}
      className="narrow"
    >
      <TreeItem id="src" title="src">
        <TreeItem id="components" title="components">
          <TreeItem id="button" title="button.tsx" />
          <TreeItem id="field" title="field.tsx" />
        </TreeItem>
        <TreeItem id="styles" title="styles">
          <TreeItem id="index" title="index.css" />
        </TreeItem>
        <TreeItem id="main" title="main.tsx" />
      </TreeItem>
      <TreeItem id="package" title="package.json" />
      <TreeItem id="readme" title="README.md" />
    </Tree>
  );
}
