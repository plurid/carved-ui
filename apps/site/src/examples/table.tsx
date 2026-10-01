import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@plurid/carved-ui-react';

const deploys = [
  { id: 'a41f', branch: 'main', region: 'Frankfurt', took: '48 s', live: true },
  { id: '9c02', branch: 'main', region: 'Virginia', took: '52 s', live: true },
  { id: '77e1', branch: 'fix/cache', region: 'Frankfurt', took: '1 min 3 s', live: false },
];

export default function Example() {
  return (
    <Table>
      <TableCaption>Deploys this week</TableCaption>
      <TableHead>
        <TableRow>
          <TableHeader>Commit</TableHeader>
          <TableHeader>Branch</TableHeader>
          <TableHeader>Region</TableHeader>
          <TableHeader>Took</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {deploys.map((deploy) => (
          <TableRow key={deploy.id}>
            <TableHeader scope="row">{deploy.id}</TableHeader>
            <TableCell>{deploy.branch}</TableCell>
            <TableCell>{deploy.region}</TableCell>
            <TableCell>{deploy.took}</TableCell>
            <TableCell>
              <Badge tone={deploy.live ? 'success' : 'danger'}>
                {deploy.live ? 'Live' : 'Failed'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
