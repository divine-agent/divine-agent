'use server';

import { getClient } from '@/hooks/apolloClient';
import { query } from '@/hooks/apolloClient';
import { getAuthContext } from '@/lib/server/auth';
import type { ActionState } from '@/lib/types/state';
import {
  CreateMyApiKeyDocument,
  RevokeMyApiKeyDocument,
  type RevokeMyApiKeyMutationVariables,
} from '@workspace/graphql-client/src/auth/api-keys.generated';
import { GetMyApiKeysDocument } from '@workspace/graphql-client/src/auth/api-keys.generated';
import type { ApiKey } from '@workspace/graphql-client/src/types.generated';
import { revalidatePath } from 'next/cache';

/**
 * getAPIKeys action with graphql query
 * @description get current user's API keys
 */
export async function getAPIKeys() {
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

/**
 * createAPIKey action with graphql mutation
 * @param _actionState
 * @param formData
 * @returns
 */
export async function createAPIKey(
  _actionState: ActionState<ApiKey>,
  formData: FormData
): Promise<ActionState<ApiKey>> {
  const context = await getAuthContext();
  if (!context) {
    return { message: 'Unauthorized', status: 'ERROR' };
  }
  const variables = {
    name: formData.get('name') as string,
  };
  const data = (
    await getClient().mutate({
      mutation: CreateMyApiKeyDocument,
      variables,
      context,
    })
  ).data?.createAPIKey;

  if (data?.data) {
    revalidatePath('/dashboard/api-keys', 'page');
    return { message: 'API Key created', status: 'SUCCESS', data: data.data };
  }
  return { message: data?.message ?? 'API Key create failed', status: 'ERROR' };
}

/**
 * revokeAPIKey action with graphql mutation
 * @param id
 * @param _actionState
 * @returns
 */
export async function revokeAPIKey(
  id: string,
  _actionState: ActionState
): Promise<ActionState> {
  const context = await getAuthContext();
  if (!context) {
    return { message: 'Unauthorized', status: 'ERROR' };
  }
  const variables: RevokeMyApiKeyMutationVariables = {
    revokeApiKeyId: id,
  };
  const data = (
    await getClient().mutate({
      mutation: RevokeMyApiKeyDocument,
      variables,
      context,
    })
  ).data?.revokeAPIKey;

  if (data?.success) {
    revalidatePath('/dashboard/api-keys', 'page');
    return { message: 'API Key revoked', status: 'SUCCESS' };
  }
  return { message: data?.message ?? 'API Key revoke failed', status: 'ERROR' };
}
