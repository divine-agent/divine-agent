import { cache } from 'react';
import 'server-only';
import { getAuthContext } from '@/lib/server/auth';
import type { ChatCompletion } from 'openai/resources/index.mjs';

export const getChatCompletion = cache(async (spanId: string) => {
  const context = await getAuthContext();
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
  const data: ChatCompletion = await response.json();
  return data;
});
