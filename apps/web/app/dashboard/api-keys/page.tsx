import { getAPIKeys } from './actions';
import { DataTable } from './components/data-table';

export default async function APIKeysPage() {
  const data = await getAPIKeys();
  if (!data) {
    return null;
  }

  return <DataTable data={data} />;
}
