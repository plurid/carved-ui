import { Checkbox, CheckboxGroup } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack">
      <Checkbox description="One message a week, at most.">Email me updates</Checkbox>
      <CheckboxGroup label="Notify me about" defaultValue={['deploys']}>
        <Checkbox value="deploys">Deploys</Checkbox>
        <Checkbox value="comments">Comments</Checkbox>
        <Checkbox value="billing" isDisabled>
          Billing
        </Checkbox>
      </CheckboxGroup>
    </div>
  );
}
