import { Accordion, Disclosure } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Accordion defaultExpandedKeys={['deploys']} className="narrow-wide">
      <Disclosure id="deploys" title="How are deploys triggered?">
        <p>Every push to main deploys once the checks pass.</p>
      </Disclosure>
      <Disclosure id="rollback" title="Can I roll back?">
        <p>Yes. Any earlier deploy can be promoted again.</p>
      </Disclosure>
      <Disclosure id="limits" title="Are there limits?">
        <p>Not on the team plan.</p>
      </Disclosure>
    </Accordion>
  );
}
