export type FetchResponse<T> = {
  message: string;
  data: T;
};

export type MutationResponse<T> = FetchResponse<T> & {
  code: number;
  success: boolean;
};

export type ErrorResponse = {
  url: string;
  status: number;
  statusText: string;
  body: FetchResponse<null>;
};
