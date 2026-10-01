import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <Card style={{ maxInlineSize: '24rem' }}>
      <CardHeader>
        <CardTitle>
          Quarry <Badge tone="success">Live</Badge>
        </CardTitle>
        <CardDescription>Deploys from main · Frankfurt and Virginia</CardDescription>
      </CardHeader>
      <CardContent>Twelve deploys this week. The last one took 48 seconds.</CardContent>
      <CardFooter>
        <Button size="sm">Open</Button>
        <Button size="sm" variant="ghost">
          Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
