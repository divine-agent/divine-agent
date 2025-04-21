'use server';

import { query } from '@/hooks/apolloClient';
import { getAuthContext } from '@/lib/server/auth';
import type { ExtendedUsageResult } from '@/lib/types/usage';
import { GetCompletionUsageDocument } from '@workspace/graphql-client/src/datapark/usages.generated';
import type {
  GroupingKey,
  UsageResult,
} from '@workspace/graphql-client/src/types.generated';
import { eachDayOfInterval, getUnixTime } from 'date-fns';
import { cache } from 'react';

export const getCompletionUsage = cache(
  async (
    startTime: Date,
    endTime: Date | undefined,
    groupBy: GroupingKey | undefined
  ) => {
    const context = await getAuthContext();
    if (!context) {
      return null;
    }
    const { data } = await query({
      query: GetCompletionUsageDocument,
      variables: {
        startTime: getUnixTime(startTime),
        endTime: getUnixTime(endTime ?? new Date()),
        groupBy,
      },
      context,
    });
    return data?.completion_usage;
  }
);

const formatDate = (timestamp: number | null | undefined) => {
  const date = timestamp ? new Date(timestamp * 1000) : new Date();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getFullCompletionUsage = cache(
  async (
    startTime: Date,
    endTime: Date | undefined,
    groupBy: GroupingKey | undefined
  ): Promise<ExtendedUsageResult[]> => {
    const usages =
      (await getCompletionUsage(startTime, endTime, groupBy)) ?? [];
    // fill in missing dates
    const usageMap = new Map<string, UsageResult>(
      usages.map((usage) => [formatDate(usage.date), usage])
    );
    // get all dates in the range
    const fullDates = eachDayOfInterval({
      start: startTime,
      end: endTime ?? new Date(),
    });
    return fullDates.map((date) => {
      const dateStr = formatDate(date.getTime() / 1000);
      const usage = usageMap.get(dateStr);
      return {
        formatted_date: dateStr,
        input_tokens: usage?.input_tokens ?? 0,
        output_tokens: usage?.output_tokens ?? 0,
        total_tokens: usage?.total_tokens ?? 0,
      };
    });
  }
);
