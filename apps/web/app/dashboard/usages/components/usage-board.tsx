'use client';

import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DatePicker } from '@/components/date-picker';
import { SectionCards } from '@/components/section-cards';
import { startOfMonth } from 'date-fns';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

export function UsageBoard() {
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({
    from: startOfMonth(today),
    to: today,
  });

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DatePicker range={range} setRangeAction={setRange} />
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
      </div>
    </div>
  );
}
