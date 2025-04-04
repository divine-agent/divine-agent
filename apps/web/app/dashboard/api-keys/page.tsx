import { getAPIKeys } from './actions';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import type { APIKey } from './data/schema';

export default async function APIKeysPage() {
  const data = (await getAPIKeys()) ?? [];

  return (
    <DataTable
      columns={columns}
      data={data.map((k) => ({ ...k, permission: 'all' }) as APIKey)}
    />
  );
}
