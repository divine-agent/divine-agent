import type { FetchResponse } from '@/types/response';
import type { ChatInput, Span, Trace, UsageResult } from '@/types/types';
import { type AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

export class DataParkAPI extends RESTDataSource {
  override baseURL = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001/';
  private token: string;

  constructor(options: { token: string; cache: KeyValueCache }) {
    super(options);
    this.token = options.token;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers.authorization = this.token;
  }

  async getTraces(sessionId: string) {
    return await this.get<FetchResponse<Trace[]>>(
      `/api/session/${sessionId}/traces`
    );
  }

  async getAllTraces() {
    return await this.get<FetchResponse<Trace[]>>('/api/trace/');
  }

  async getSpans(traceId: string) {
    return await this.get<FetchResponse<Span[]>>(`/api/trace/${traceId}/spans`);
  }

  async getChatInput(spanId: string) {
    return await this.get<FetchResponse<ChatInput>>(
      `/api/v1/chat/completions/${spanId}/input`
    );
  }

  async getCompletionUsage(
    startTime: number,
    endTime: number | undefined,
    groupBy: string | undefined
  ) {
    return await this.get<FetchResponse<UsageResult[]>>(
      '/api/usage/completions',
      {
        params: {
          start_time: startTime.toString(),
          end_time: endTime?.toString(),
          group_by: groupBy,
        },
      }
    );
  }
}
