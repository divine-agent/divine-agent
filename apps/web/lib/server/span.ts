import 'server-only';
import { query } from '@/hooks/apolloClient';
import { GetSpansDocument } from '@workspace/graphql-client/src/datapark/traces.generated';
import { cache } from 'react';
import { getAuthContext } from './auth';

/**
 * getSpans action with graphql query
 * @description get spans for a trace
 */
export const getSpans = cache(async (traceId: string) => {
  const context = await getAuthContext();
  if (!context) {
    return null;
  }
  const { data } = await query({
    query: GetSpansDocument,
    variables: { traceId },
    context,
  });
  return data?.spans;
});
