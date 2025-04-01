import 'server-only';
import { query } from '@/hooks/apolloClient';
import { getSessionTokenCookie } from '@/lib/server/cookies';
import { GetCurrentUserDocument } from '@workspace/graphql-client/src/auth/user.generated';
import { cache } from 'react';

export const getCurrentUser = cache(async () => {
  const context = await getAuthContext();
  if (!context) {
    return null;
  }

  const { data } = await query({
    query: GetCurrentUserDocument,
    context,
  }).catch((_) => ({ data: null }));
  return data?.me;
});

export const getAuthContext = async () => {
  const token = await getSessionTokenCookie();
  return token ? { headers: { authorization: `Bearer ${token}` } } : null;
};
