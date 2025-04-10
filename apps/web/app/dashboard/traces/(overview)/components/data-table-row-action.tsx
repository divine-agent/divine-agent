import type { Row } from '@tanstack/react-table';
import { Button } from '@workspace/ui/components/button';
import { Expand, Eye } from 'lucide-react';
import Link from 'next/link';
import { traceSchema } from '../data/schema';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const trace = traceSchema.parse(row.original);
  const href = `/dashboard/traces/${trace.id}`;

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href={href} passHref>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <a href={href}>
          <Expand className="h-4 w-4 text-muted-foreground" />
        </a>
      </Button>
    </div>
  );
}
