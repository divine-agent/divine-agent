'use client';

import { format, startOfMonth, startOfWeek, subDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { Calendar } from '@/components/calendar';
import { Button } from '@workspace/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';

interface DatePickerProps {
  range: DateRange | undefined;
  setRangeAction: (range: DateRange) => void;
}

export function DatePicker({
  range,
  setRangeAction,
  className,
}: React.HTMLAttributes<HTMLDivElement> & DatePickerProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-fit justify-start text-left font-normal',
              !range && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, 'LLL dd, y')} -{' '}
                  {format(range.to, 'LLL dd, y')}
                </>
              ) : (
                format(range.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto p-0" align="start">
          <DateRangePresets setRangeAction={setRangeAction} />
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={setRangeAction}
            numberOfMonths={2}
            required
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DateRangePresets({
  setRangeAction,
}: {
  setRangeAction: (date: DateRange) => void;
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
          onClick={() => setRangeAction({ from: preset.from, to: preset.to })}
        >
          {preset.name}
        </Button>
      ))}
    </div>
  );
}
