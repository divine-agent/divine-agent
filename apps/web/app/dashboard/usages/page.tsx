import { getCompletionUsage, getFullCompletionUsage } from './actions';
import { UsageBoard } from './components/usage-board';

export default function Page() {
  return (
    <UsageBoard
      getCompletionUsageAction={getCompletionUsage}
      getFullCompletionUsageAction={getFullCompletionUsage}
    />
  );
}
