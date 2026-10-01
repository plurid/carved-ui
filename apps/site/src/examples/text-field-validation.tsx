import { Button, Form, TextField } from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Form className="stack narrow" onSubmit={(event) => event.preventDefault()}>
      <TextField
        label="Email"
        name="email"
        type="email"
        isRequired
        description="We send receipts here."
      />
      <TextField
        label="Username"
        name="username"
        isRequired
        validate={(value) => (value.length < 3 ? 'Use at least three characters.' : null)}
      />
      <Button type="submit">Create account</Button>
    </Form>
  );
}
