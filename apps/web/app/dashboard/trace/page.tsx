import { query } from '@/hooks/apolloClient';
import { getAuthContext } from '@/lib/server/auth';
import { GetAllTracesDocument } from '@workspace/graphql-client/datapark/traces.generated';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import type { Trace } from './data/schema';

async function getAllTraces() {
  const context = await getAuthContext();
  if (!context) {
    return null;
  }
  const { data } = await query({
    query: GetAllTracesDocument,
    context,
  });
  return data?.all_traces;
}

export default async function TracesPage() {
  const data = (await getAllTraces()) ?? [];

  return (
    <DataTable
      data={data.map(
        (trace) =>
          ({
            ...trace,
            end_time: trace.end_time.Valid ? trace.end_time.Time : undefined,
            status: trace.end_time.Valid ? 'done' : 'running',
          }) as Trace
      )}
      columns={columns}
    />
  );
}
