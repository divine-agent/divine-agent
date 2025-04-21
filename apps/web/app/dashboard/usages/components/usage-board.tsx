'use client';

import { DatePicker } from '@/components/date-picker';
import type { ExtendedUsageResult } from '@/lib/types/usage';
import {
  GroupingKey,
  type UsageResult,
} from '@workspace/graphql-client/src/types.generated';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { UsageLineChartCard, UsagePieChartCard } from './usage-chart';

interface UsageBoardProps {
  initialRange: DateRange;
  initialUsages?: ExtendedUsageResult[];
  initialUsagesGroupByModel?: UsageResult[];
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
  initialRange,
  initialUsages,
  initialUsagesGroupByModel,
  getCompletionUsageAction,
  getFullCompletionUsageAction,
}: UsageBoardProps) {
  const today = new Date();
  const [range, setRange] = useState<DateRange>(initialRange);
  const [usages, setUsages] = useState<ExtendedUsageResult[] | undefined>(
    initialUsages
  );
  const [usagesGroupByModel, setUsagesGroupByModel] = useState<
    UsageResult[] | undefined
  >(initialUsagesGroupByModel);

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
