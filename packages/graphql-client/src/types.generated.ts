export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** APIKey is a key used to authenticate requests to the API */
export type ApiKey = {
  __typename?: 'APIKey';
  api_key: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

/** CreateAPIKeyResponse is a response to the createAPIKey mutation */
export type CreateApiKeyResponse = MutationResponse & {
  __typename?: 'CreateAPIKeyResponse';
  code: Scalars['Int']['output'];
  data?: Maybe<ApiKey>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** CreateTokenResponse is a response to the login mutation */
export type CreateTokenResponse = MutationResponse & {
  __typename?: 'CreateTokenResponse';
  code: Scalars['Int']['output'];
  data?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** Mutation is a collection of mutations that can be made to the API */
export type Mutation = {
  __typename?: 'Mutation';
  /** API Key Mutations */
  createAPIKey: CreateApiKeyResponse;
  /** Auth Mutations */
  login: CreateTokenResponse;
  loginWithAPIKey: CreateTokenResponse;
  revokeAPIKey: RevokeApiKeyResponse;
};


/** Mutation is a collection of mutations that can be made to the API */
export type MutationLoginArgs = {
  identity: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


/** Mutation is a collection of mutations that can be made to the API */
export type MutationLoginWithApiKeyArgs = {
  api_key: Scalars['String']['input'];
};


/** Mutation is a collection of mutations that can be made to the API */
export type MutationRevokeApiKeyArgs = {
  id: Scalars['ID']['input'];
};

/** MutationResponse is a response to a mutation */
export type MutationResponse = {
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** Query is a collection of queries that can be made to the API */
export type Query = {
  __typename?: 'Query';
  /** Fetch a specific user by id */
  user: User;
};


/** Query is a collection of queries that can be made to the API */
export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

/** RevokeAPIKeyResponse is a response to the revokeAPIKey mutation */
export type RevokeApiKeyResponse = MutationResponse & {
  __typename?: 'RevokeAPIKeyResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** User is a registered user of the application */
export type User = {
  __typename?: 'User';
  api_keys?: Maybe<Array<Maybe<ApiKey>>>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};
