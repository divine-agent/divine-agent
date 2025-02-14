export type FetchResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export type User = {
  id: number;
  username: string;
  email: string;
  api_keys: APIKey[];
};

export type APIKey = {
  id: number;
  api_key: string;
};
