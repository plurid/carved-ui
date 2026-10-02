import {
  Cell,
  Column,
  DataTable,
  DataTableBody,
  DataTableHeader,
  Row,
  Spinner,
} from '@plurid/carved-ui-react';

export default function Example() {
  return (
    <div className="stack">
      <DataTable aria-label="Files" isResizable>
        <DataTableHeader>
          <Column isRowHeader allowsResizing defaultWidth="1fr" minWidth={120}>
            Name
          </Column>
          <Column allowsResizing defaultWidth={140}>
            Owner
          </Column>
          <Column defaultWidth={100}>Size</Column>
        </DataTableHeader>
        <DataTableBody>
          <Row>
            <Cell>Brand guidelines.pdf</Cell>
            <Cell>Ana Pop</Cell>
            <Cell>4.2 MB</Cell>
          </Row>
          <Row>
            <Cell>Quarterly report.xlsx</Cell>
            <Cell>Ioan Marin</Cell>
            <Cell>860 KB</Cell>
          </Row>
        </DataTableBody>
      </DataTable>
      <DataTable aria-label="Invoices">
        <DataTableHeader>
          <Column isRowHeader>Invoice</Column>
          <Column>Amount</Column>
        </DataTableHeader>
        <DataTableBody renderEmptyState={() => <Spinner aria-label="Loading invoices" />}>
          {[]}
        </DataTableBody>
      </DataTable>
    </div>
  );
}
