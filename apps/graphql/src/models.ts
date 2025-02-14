export type FetchResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export type User = {
  id: number;
  username: string;
  email: string;
};
