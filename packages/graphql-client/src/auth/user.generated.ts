import type * as Types from '../types.generated';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export type NullTime = {
  __typename?: 'NullTime';
  Time: Scalars['String']['output'];
  Valid: Scalars['Boolean']['output'];
};

/** Query is a collection of queries that can be made to the API */
export type Query = {
  __typename?: 'Query';
  /** Fetch all traces */
  all_traces?: Maybe<Array<Trace>>;
  /** Fetch current user's API keys */
  api_keys?: Maybe<Array<ApiKey>>;
  /** Fetch current user */
  me: User;
  /** Fetch traces by session id */
  traces?: Maybe<Array<Trace>>;
  /** Fetch a specific user by id */
  user: User;
};


/** Query is a collection of queries that can be made to the API */
export type QueryTracesArgs = {
  session_id: Scalars['ID']['input'];
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

/** Trace is a record to track the execution of a session */
export type Trace = {
  __typename?: 'Trace';
  end_time: NullTime;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  session_id: Scalars['ID']['output'];
  start_time: Scalars['String']['output'];
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

export type SignupMutationVariables = Types.Exact<{
  username: Types.Scalars['String']['input'];
  email: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;


export type SignupMutation = { __typename?: 'Mutation', createUser: { __typename?: 'CreateUserResponse', code: number, success: boolean, message: string, data?: { __typename?: 'User', id: string, email: string, username: string } | null } };

export type UpdateAccountMutationVariables = Types.Exact<{
  updateUserId: Types.Scalars['ID']['input'];
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type UpdateAccountMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UpdateUserResponse', code: number, message: string, data?: { __typename?: 'User', name?: string | null } | null } };

export type GetCurrentUserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, name?: string | null, username: string } };


export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const UpdateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAccountMutation, UpdateAccountMutationVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;