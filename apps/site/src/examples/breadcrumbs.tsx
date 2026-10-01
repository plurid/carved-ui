import { Breadcrumb, Breadcrumbs } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Breadcrumbs>
      <Breadcrumb href="#workspace">Workspace</Breadcrumb>
      <Breadcrumb href="#projects">Projects</Breadcrumb>
      <Breadcrumb>Quarry</Breadcrumb>
    </Breadcrumbs>
  );
}
