import { query } from '@/hooks/apolloClient';
import { GetScoresDocument } from '@workspace/graphql-client/src/datapark/evaluation.generated';
import { cache } from 'react';
import { getAuthContext } from './auth';

export const getScores = cache(async (traceId: string) => {
  const context = await getAuthContext();
  if (!context) {
    return null;
  }
  const { data } = await query({
    query: GetScoresDocument,
    variables: { traceId },
    context,
  });
  return data?.scores;
});
