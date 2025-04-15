'use client';

import { format, startOfMonth, startOfWeek, subDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { Calendar } from '@/components/calendar';
import { Button } from '@workspace/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';

export function DatePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const today = new Date();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: today,
  });

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-fit justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto p-0" align="start">
          <DateRangePresets setDateAction={setDate} />
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DateRangePresets({
  setDateAction,
}: {
  setDateAction: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}) {
  const today = new Date();
  const presets = [
    {
      name: 'Week to date',
      from: startOfWeek(today, { weekStartsOn: 1 }),
      to: today,
    },
    { name: 'Month to date', from: startOfMonth(today), to: today },
    { name: 'Last 7 days', from: subDays(today, 7), to: today },
    { name: 'Last 14 days', from: subDays(today, 14), to: today },
    { name: 'Last 30 days', from: subDays(today, 30), to: today },
  ];
  return (
    <div className="flex flex-col gap-2 border-r px-2 py-3">
      {presets.map((preset) => (
        <Button
          key={preset.name}
          variant="ghost"
          onClick={() => setDateAction({ from: preset.from, to: preset.to })}
        >
          {preset.name}
        </Button>
      ))}
    </div>
  );
}
