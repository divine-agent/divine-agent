import type { Span } from '@workspace/graphql-client/src/types.generated';
import type { ChatCompletion } from 'openai/resources/index.mjs';

/**
 * ExtendSpan interface
 * @description Extend the Span interface to include relative_start_time
 */
export interface ExtendedSpan extends Span {
  relative_start_time: number;
  data?: ChatCompletion;
}
