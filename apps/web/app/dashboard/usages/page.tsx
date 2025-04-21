import { GroupingKey } from '@workspace/graphql-client/src/types.generated';
import { startOfMonth } from 'date-fns';
import { getCompletionUsage, getFullCompletionUsage } from './actions';
import { UsageBoard } from './components/usage-board';

export default async function Page() {
  const today = new Date();
  const range = {
    from: startOfMonth(today),
    to: today,
  };
  const usages = await getFullCompletionUsage(
    range.from,
    range.to,
    GroupingKey.Date
  );
  const usagesGroupByModel =
    (await getCompletionUsage(range.from, range.to, GroupingKey.Model)) ?? [];

  return (
    <UsageBoard
      initialRange={range}
      initialUsages={usages}
      initialUsagesGroupByModel={usagesGroupByModel}
      getCompletionUsageAction={getCompletionUsage}
      getFullCompletionUsageAction={getFullCompletionUsage}
    />
  );
}
