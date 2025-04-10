'use client';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import type { z } from 'zod';
import { statuses } from '../data/data';
import type { traceSchema } from '../data/schema';
import { DataTableRowActions } from './data-table-row-action';

export const columns: ColumnDef<z.infer<typeof traceSchema>>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trace ID" />
    ),
    cell: ({ row }) => (
      <Link href={`/dashboard/traces/${row.getValue('id')}`} passHref>
        {row.getValue('id')}
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGrouping: false,
  },
  {
    accessorKey: 'session_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Session ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] truncate">{row.getValue('session_id')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('name')}
          </span>
        </div>
      );
    },
    enableGrouping: false,
  },
  {
    accessorKey: 'start_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => formatDate(row.getValue('start_time')),
    enableGrouping: false,
  },
  {
    accessorKey: 'end_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Time" />
    ),
    cell: ({ row }) => formatDate(row.getValue('end_time')),
    enableGrouping: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      );
      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableGrouping: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
