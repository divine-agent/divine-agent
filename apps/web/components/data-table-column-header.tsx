import type { Column } from '@tanstack/react-table';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { cn } from '@workspace/ui/lib/utils';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  EyeOff,
  List,
  ListCollapse,
} from 'lucide-react';
import type * as React from 'react';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanGroup() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className=" h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            <HeaderIcon column={column} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
                Desc
              </DropdownMenuItem>
            </>
          )}
          {column.getCanGroup() && (
            <DropdownMenuItem onClick={column.getToggleGroupingHandler()}>
              {column.getIsGrouped() ? <List /> : <ListCollapse />}
              {column.getIsGrouped() ? 'Cancel Group' : 'Group'}
            </DropdownMenuItem>
          )}
          {column.getCanHide() && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
              Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function HeaderIcon<TData, TValue>({
  column,
}: { column: Column<TData, TValue> }) {
  if (column.getCanGroup()) {
    if (column.getIsGrouped()) {
      return <ChevronRight />;
    }
    return <ChevronDown />;
  }

  if (column.getCanSort()) {
    if (column.getIsSorted() === 'asc') {
      return <ArrowUp />;
    }
    if (column.getIsSorted() === 'desc') {
      return <ArrowDown />;
    }
    return <ChevronsUpDown />;
  }

  return null;
}
