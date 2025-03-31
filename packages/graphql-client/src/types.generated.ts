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
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
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

/** CreateUserResponse is a response to the createUser mutation */
export type CreateUserResponse = MutationResponse & {
  __typename?: 'CreateUserResponse';
  code: Scalars['Int']['output'];
  data?: Maybe<User>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** DeleteUserResponse is a response to the deleteUser mutation */
export type DeleteUserResponse = MutationResponse & {
  __typename?: 'DeleteUserResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** Mutation is a collection of mutations that can be made to the API */
export type Mutation = {
  __typename?: 'Mutation';
  /** API Key Mutations */
  createAPIKey: CreateApiKeyResponse;
  /** User Mutations */
  createUser: CreateUserResponse;
  deleteUser: DeleteUserResponse;
  /** Auth Mutations */
  login: CreateTokenResponse;
  loginWithAPIKey: CreateTokenResponse;
  revokeAPIKey: RevokeApiKeyResponse;
  updateAPIKey: UpdateApiKeyResponse;
  updateUser: UpdateUserResponse;
};


/** Mutation is a collection of mutations that can be made to the API */
export type MutationCreateApiKeyArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation is a collection of mutations that can be made to the API */
export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


/** Mutation is a collection of mutations that can be made to the API */
export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
  password: Scalars['String']['input'];
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


/** Mutation is a collection of mutations that can be made to the API */
export type MutationUpdateApiKeyArgs = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation is a collection of mutations that can be made to the API */
export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
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
  /** Fetch current user's API keys */
  api_keys?: Maybe<Array<ApiKey>>;
  /** Fetch current user */
  me: User;
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

/** UpdateAPIKeyResponse is a response to the updateAPIKey mutation */
export type UpdateApiKeyResponse = MutationResponse & {
  __typename?: 'UpdateAPIKeyResponse';
  code: Scalars['Int']['output'];
  data?: Maybe<ApiKey>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** UpdateUserResponse is a response to the updateUser mutation */
export type UpdateUserResponse = MutationResponse & {
  __typename?: 'UpdateUserResponse';
  code: Scalars['Int']['output'];
  data?: Maybe<User>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** User is a registered user of the application */
export type User = {
  __typename?: 'User';
  api_keys?: Maybe<Array<ApiKey>>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};
