import 'server-only';
import { query } from '@/hooks/apolloClient';
import type { Chat, ExtendedSpan } from '@/lib/types/span';
import { GetSpansDocument } from '@workspace/graphql-client/src/datapark/traces.generated';
import {
  Kind,
  type Score,
  type Span,
} from '@workspace/graphql-client/src/types.generated';
import { cache } from 'react';
import { getAuthContext } from './auth';
import { getScores } from './evaluation';
import { getChat } from './openai';

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

/**
 * getTraceChartData action with getSpans
 * @description get spans for a trace and sort them
 */
export const getTraceChartData = cache(
  async (traceId: string): Promise<ExtendedSpan[]> => {
    // get spans for a trace
    let [spans, scores] = await Promise.all([
      getSpans(traceId),
      getScores(traceId),
    ]);
    if (!spans) {
      return [];
    }
    // sort spans in a tree structure
    spans = sortSpans(spans);
    // get chat input and completion for LLM span
    const llmSpanIds = spans
      .filter((span) => span.kind === Kind.SpanKindLlm && span.end_time.Valid)
      .map((s) => s.id);
    const chats = await Promise.all(llmSpanIds.map((id) => getChat(id)));
    const chatsMap = new Map<string, Chat>(
      chats.map((chat) => [chat.span_id, chat])
    );
    const scoresMap = new Map<string, Score[]>();
    // group scores by span_id
    if (scores) {
      for (const score of scores) {
        const spanId = score.span_id;
        if (!scoresMap.has(spanId)) {
          scoresMap.set(spanId, []);
        }
        scoresMap.get(spanId)?.push(score);
      }
    }
    // calculate relative start_time with milliseconds
    const startTime = new Date(spans[0]?.start_time).getTime();
    return spans.map((span) => {
      const chat = chatsMap.get(span.id);
      return {
        ...span,
        relative_start_time: new Date(span.start_time).getTime() - startTime,
        input: chat?.input,
        completion: chat?.completion,
        duration: span.end_time.Valid
          ? span.duration
          : Date.now() - new Date(span.start_time).getTime(),
        scores:
          span.kind === Kind.SpanKindEvaluation ? scoresMap.get(span.id) : [],
      };
    });
  }
);

/**
 * Sort spans in a tree structure
 * @description 1. parent span comes before child span
 * @description 2. same level spans are sorted by start_time
 * @param spans - Array of spans
 * @returns - Sorted array of spans
 * @throws - Error if a cycle is detected
 * @private
 */
function sortSpans(spans: Span[]) {
  // 1. create two maps: id -> span and parent_id -> spans
  const spanMap: Map<string, Span> = new Map();
  const childrenMap: Map<string, Span[]> = new Map();
  for (const span of spans) {
    spanMap.set(span.id, span);
    const pid = span.parent_id;
    if (pid) {
      if (!childrenMap.has(pid)) {
        childrenMap.set(pid, []);
      }
      childrenMap.get(pid)?.push(span);
    }
  }

  // 2. same level spans are sorted by start_time
  const parseTime = (t: string) => new Date(t).getTime();
  for (const [_pid, children] of childrenMap) {
    children.sort((a, b) => parseTime(a.start_time) - parseTime(b.start_time));
  }

  // 3. DFS to sort spans
  const result: Span[] = [];
  const visiting = new Set(); // detect cycles
  const visited = new Set(); // avoid processing the same span multiple times

  function dfs(span: Span) {
    if (visiting.has(span.id) || visited.has(span.id)) {
      return;
    }

    visiting.add(span.id);
    result.push(span);
    visited.add(span.id);

    const children = childrenMap.get(span.id) || [];
    for (const child of children) {
      dfs(child);
    }

    visiting.delete(span.id);
  }

  // 4. find root spans and sort them by start_time
  const rootSpans = spans.filter((span) => !span.parent_id);
  rootSpans.sort((a, b) => parseTime(a.start_time) - parseTime(b.start_time));

  // 5. DFS for each root span
  for (const root of rootSpans) {
    dfs(root);
  }

  return result;
}
