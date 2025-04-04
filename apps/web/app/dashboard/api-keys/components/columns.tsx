'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@workspace/ui/lib/utils';
import type { z } from 'zod';
import { permissions } from '../data/data';
import type { apiKeySchema } from '../data/schema';
import { TableCellViewer } from './data-table-cell-viewer';
import { DeleteDialog } from './delete-dialog';

export const columns: ColumnDef<z.infer<typeof apiKeySchema>>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableGrouping: false,
  },
  {
    accessorKey: 'api_key',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="API Key" />
    ),
    cell: ({ row }) => row.original.api_key,
    enableHiding: false,
    enableSorting: false,
    enableGrouping: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => formatDate(row.original.created_at),
    enableGrouping: false,
  },
  {
    accessorKey: 'permission',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Permission" />
    ),
    cell: ({ row }) => {
      const permission = permissions.find(
        (permission) => permission.value === row.getValue('permission')
      );
      if (!permission) {
        return null;
      }
      return (
        <div className="flex w-[100px] items-center">
          {permission.icon && (
            <permission.icon
              className={cn(
                'mr-2 h-4 w-4 text-muted-foreground',
                permission.className
              )}
            />
          )}
          <span>{permission.label}</span>
        </div>
      );
    },
    enableGrouping: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DeleteDialog apiKey={row.original} />,
  },
];
