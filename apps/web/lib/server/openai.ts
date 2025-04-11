import { cache } from 'react';
import 'server-only';
import { query } from '@/hooks/apolloClient';
import { getAuthContext } from '@/lib/server/auth';
import type { Chat } from '@/lib/types/span';
import { GetChatInputDocument } from '@workspace/graphql-client/src/datapark/openai.generated';
import type { ChatCompletion } from 'openai/resources/index.mjs';

export const getChatCompletion = cache(async (spanId: string) => {
  const context = await getAuthContext();
  if (!context) {
    return null;
  }
  const response = await fetch(
    `http://localhost:3001/api/v1/chat/completions/${spanId}`,
    {
      cache: 'force-cache',
      ...context,
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch chat completion');
  }
  return response.json().then((res) => res.data) as Promise<ChatCompletion>;
});

export const getChatInput = cache(async (spanId: string) => {
  const context = await getAuthContext();
  if (!context) {
    return null;
  }
  const { data } = await query({
    query: GetChatInputDocument,
    variables: { spanId },
    context,
  });
  return data?.chat_input;
});

export const getChat = cache(async (spanId: string) => {
  const input = await getChatInput(spanId);
  const completion = await getChatCompletion(spanId);
  return {
    span_id: spanId,
    input: input ?? undefined,
    completion: completion ?? undefined,
  } as Chat;
});
