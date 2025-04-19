'use client';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DatePicker } from '@/components/date-picker';
import { SectionCards } from '@/components/section-cards';
import type { UsageResult } from '@workspace/graphql-client/src/auth/login.generated';
import { GroupingKey } from '@workspace/graphql-client/src/types.generated';
import { startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { UsageLineChart } from './usage-chart';

interface UsageBoardProps {
  getCompletionUsageAction: (
    startTime: Date,
    endTime: Date | undefined,
    groupBy: GroupingKey | undefined
  ) => Promise<UsageResult[] | null | undefined>;
}

export function UsageBoard({ getCompletionUsageAction }: UsageBoardProps) {
  const today = new Date();

  const [range, setRange] = useState<DateRange>({
    from: startOfMonth(today),
    to: today,
  });

  const [usages, setUsages] = useState<UsageResult[]>([]);
  const [usagesGroupByModel, setUsagesGroupByModel] = useState<UsageResult[]>(
    []
  );

  const fetchUsages = async (start: Date, end: Date) => {
    const usages = await getCompletionUsageAction(start, end, GroupingKey.Date);
    setUsages(usages ?? []);
    const grouped = await getCompletionUsageAction(
      start,
      end,
      GroupingKey.Model
    );
    setUsagesGroupByModel(grouped ?? []);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchUsages is not a dependency
  useEffect(() => {
    fetchUsages(startOfMonth(today), today);
  }, []);

  const setRangeAction = async (range: DateRange) => {
    const startTime = range.from ?? today;
    const endTime = range.to ?? today;
    setRange({ from: startTime, to: endTime });
    await fetchUsages(startTime, endTime);
  };

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DatePicker range={range} setRangeAction={setRangeAction} />
        {JSON.stringify(usages)}
        {JSON.stringify(usagesGroupByModel)}
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
          <UsageLineChart data={usages} />
        </div>
      </div>
    </div>
  );
}
