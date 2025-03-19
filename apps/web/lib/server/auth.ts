import 'server-only';
import { query } from '@/hooks/apolloClient';
import { getSessionTokenCookie } from '@/lib/server/cookies';
import { GetCurrentUserDocument } from '@workspace/graphql-client/src/auth/user.generated';
import { cache } from 'react';

export const getCurrentUser = cache(async () => {
  const token = await getSessionTokenCookie();
  if (!token) {
    return null;
  }
  const { data } = await query({
    query: GetCurrentUserDocument,
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  return data?.me;
});
