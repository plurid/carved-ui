import { Fieldset, Form, TextField } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Form className="narrow">
      <Fieldset legend="Billing address">
        <TextField label="Street" autoComplete="street-address" />
        <TextField label="City" autoComplete="address-level2" />
        <TextField label="Postal code" autoComplete="postal-code" />
      </Fieldset>
    </Form>
  );
}
