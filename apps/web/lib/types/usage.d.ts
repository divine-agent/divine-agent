import type { UsageResult } from '@workspace/graphql-client/src/types.generated';

/**
 * ExtendedUsageResult interface
 * @description Extend the UsageResult interface to include formatted date
 */
export interface ExtendedUsageResult extends UsageResult {
  formatted_date: string;
}
