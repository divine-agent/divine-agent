import type { Span } from '@workspace/graphql-client/src/types.generated';
import type { ChatInput } from '@workspace/graphql-client/src/types.generated';
import type { ChatCompletion } from 'openai/resources/index.mjs';

/**
 * ExtendedSpan interface
 * @description Extend the Span interface to include relative_start_time
 */
export interface ExtendedSpan extends Span {
  relative_start_time: number;
  input?: ChatInput;
  completion?: ChatCompletion;
}

/**
 * Chat interface
 * @description Chat interface for chat input and completion
 */
export interface Chat {
  span_id: string;
  input?: ChatInput;
  completion?: ChatCompletion;
}
