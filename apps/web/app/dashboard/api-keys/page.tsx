import { query } from '@/hooks/apolloClient';
import { getAuthContext } from '@/lib/server/auth';
import { GetMyApiKeysDocument } from '@workspace/graphql-client/src/auth/api-keys.generated';
import { DataTable } from './components/data-table';

/**
 * getAPIKeys action with graphql query
 * @description get current user's API keys
 */
async function getAPIKeys() {
  'use server';

  const context = await getAuthContext();
  if (!context) {
    return null;
  }
  const { data } = await query({
    query: GetMyApiKeysDocument,
    context,
  });
  return data?.api_keys;
}

export default async function APIKeysPage() {
  const data = await getAPIKeys();
  if (!data) {
    return null;
  }

  return <DataTable data={data} />;
}
