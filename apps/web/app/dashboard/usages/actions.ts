'use server';

import { query } from '@/hooks/apolloClient';
import { getAuthContext } from '@/lib/server/auth';
import { GetCompletionUsageDocument } from '@workspace/graphql-client/src/datapark/usages.generated';
import type { GroupingKey } from '@workspace/graphql-client/src/types.generated';
import { getUnixTime } from 'date-fns';

export async function getCompletionUsage(
  startTime: Date,
  endTime: Date | undefined,
  groupBy: GroupingKey | undefined
) {
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
