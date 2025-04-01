import { type Cell, type Row, flexRender } from '@tanstack/react-table';
import { Button } from '@workspace/ui/components/button';
import { TableCell, TableRow } from '@workspace/ui/components/table';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DataTableRow<TData> {
  row: Row<TData>;
}

export function DataTableRow<TData>({ row }: DataTableRow<TData>) {
  return (
    <TableRow data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell) => (
        <DataTableGroupedCell key={cell.id} row={row} cell={cell} />
      ))}
    </TableRow>
  );
}

function DataTableGroupedCell<TData>({
  row,
  cell,
}: {
  row: Row<TData>;
  cell: Cell<TData, unknown>;
}) {
  if (cell.getIsGrouped()) {
    return (
      <TableCell>
        <Button
          variant="ghost"
          onClick={row.getToggleExpandedHandler()}
          style={{ cursor: row.getCanExpand() ? 'pointer' : 'normal' }}
        >
          {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
          {flexRender(cell.column.columnDef.cell, cell.getContext())} (
          {row.subRows.length})
        </Button>
      </TableCell>
    );
  }

  if (cell.getIsAggregated()) {
    return (
      <TableCell>
        {flexRender(
          cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
          cell.getContext()
        )}
      </TableCell>
    );
  }

  if (cell.getIsPlaceholder()) {
    return <TableCell />;
  }

  return (
    <TableCell>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}
