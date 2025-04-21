'use client';

import { DatePicker } from '@/components/date-picker';
import type { ExtendedUsageResult } from '@/lib/types/usage';
import {
  GroupingKey,
  type UsageResult,
} from '@workspace/graphql-client/src/types.generated';
import { startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { UsageLineChartCard, UsagePieChartCard } from './usage-chart';

interface UsageBoardProps {
  getFullCompletionUsageAction: (
    startTime: Date,
    endTime: Date | undefined,
    groupBy: GroupingKey | undefined
  ) => Promise<ExtendedUsageResult[] | null | undefined>;
  getCompletionUsageAction: (
    startTime: Date,
    endTime: Date | undefined,
    groupBy: GroupingKey | undefined
  ) => Promise<UsageResult[] | null | undefined>;
}

export function UsageBoard({
  getCompletionUsageAction,
  getFullCompletionUsageAction,
}: UsageBoardProps) {
  const today = new Date();

  const [range, setRange] = useState<DateRange>({
    from: startOfMonth(today),
    to: today,
  });

  const [usages, setUsages] = useState<ExtendedUsageResult[]>([]);
  const [usagesGroupByModel, setUsagesGroupByModel] = useState<UsageResult[]>(
    []
  );

  const fetchUsages = async (start: Date, end: Date) => {
    const usages = await getFullCompletionUsageAction(
      start,
      end,
      GroupingKey.Date
    );
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
    <div className="@container/main flex flex-col gap-4">
      <DatePicker range={range} setRangeAction={setRangeAction} />
      <UsagePieChartCard data={usagesGroupByModel} />
      <UsageLineChartCard data={usages} />
    </div>
  );
}
