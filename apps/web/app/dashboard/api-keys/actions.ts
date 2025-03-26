'use server';

import { getClient } from '@/hooks/apolloClient';
import { getAuthContext } from '@/lib/server/auth';
import type { ActionState } from '@/lib/types/state';
import {
  CreateMyApiKeyDocument,
  RevokeMyApiKeyDocument,
  type RevokeMyApiKeyMutationVariables,
} from '@workspace/graphql-client/src/auth/api-keys.generated';

export async function createAPIKey(
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
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
    return { message: 'API Key created', status: 'SUCCESS' };
  }
  return { message: data?.message ?? 'API Key create failed', status: 'ERROR' };
}

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
    return { message: 'API Key revoked', status: 'SUCCESS' };
  }
  return { message: data?.message ?? 'API Key revoke failed', status: 'ERROR' };
}
