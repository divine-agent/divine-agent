import { GraphQLResolveInfo } from 'graphql';
import { UserModel } from './user';
import { APIKeyModel } from './api-key';
import { DataSourceContext } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

/** OpenInput is the input for the OpenAI API */
export type ChatInput = {
  __typename?: 'ChatInput';
  logprobs?: Maybe<Scalars['Boolean']['output']>;
  messages?: Maybe<Array<MessageInput>>;
  model: Scalars['String']['output'];
  n?: Maybe<Scalars['Int']['output']>;
  stream?: Maybe<Scalars['Boolean']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  top_logprobs?: Maybe<Scalars['Int']['output']>;
  top_p?: Maybe<Scalars['Float']['output']>;
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

/** GroupingKey is an enum that represents the key used to group usage results */
export enum GroupingKey {
  Date = 'date',
  Model = 'model'
}

/** KeyValue is a key-value pair */
export type KeyValue = {
  __typename?: 'KeyValue';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** Kind is an enum that represents the type of span */
export enum Kind {
  SpanKindFunction = 'SPAN_KIND_FUNCTION',
  SpanKindLlm = 'SPAN_KIND_LLM'
}

/** MessageInput is a message sent to the OpenAI API */
export type MessageInput = {
  __typename?: 'MessageInput';
  content: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
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

/** NullTime is a custom scalar type that represents a time value that can be null */
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
  /** Fetch openai input by span id */
  chat_input?: Maybe<ChatInput>;
  /** Fetch completion usages */
  completion_usage?: Maybe<Array<UsageResult>>;
  /** Fetch current user */
  me: User;
  /** Fetch all spans by trace id */
  spans?: Maybe<Array<Span>>;
  /** Fetch traces by session id */
  traces?: Maybe<Array<Trace>>;
  /** Fetch a specific user by id */
  user: User;
};


/** Query is a collection of queries that can be made to the API */
export type QueryChat_InputArgs = {
  span_id: Scalars['ID']['input'];
};


/** Query is a collection of queries that can be made to the API */
export type QueryCompletion_UsageArgs = {
  end_time?: InputMaybe<Scalars['Int']['input']>;
  group_by?: InputMaybe<GroupingKey>;
  start_time: Scalars['Int']['input'];
};


/** Query is a collection of queries that can be made to the API */
export type QuerySpansArgs = {
  trace_id: Scalars['ID']['input'];
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

/** Span is a record of a single unit of work within a trace */
export type Span = {
  __typename?: 'Span';
  duration: Scalars['Float']['output'];
  end_time: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kind: Kind;
  metadata?: Maybe<Array<KeyValue>>;
  name: Scalars['String']['output'];
  parent_id: Scalars['ID']['output'];
  start_time: Scalars['String']['output'];
  trace_id: Scalars['ID']['output'];
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

/** UsageResult is the result of a usage query */
export type UsageResult = {
  __typename?: 'UsageResult';
  date?: Maybe<Scalars['Int']['output']>;
  input_tokens: Scalars['Int']['output'];
  model?: Maybe<Scalars['String']['output']>;
  output_tokens: Scalars['Int']['output'];
  total_tokens: Scalars['Int']['output'];
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  MutationResponse: ( Omit<CreateApiKeyResponse, 'data'> & { data?: Maybe<_RefType['APIKey']> } ) | ( CreateTokenResponse ) | ( Omit<CreateUserResponse, 'data'> & { data?: Maybe<_RefType['User']> } ) | ( DeleteUserResponse ) | ( RevokeApiKeyResponse ) | ( Omit<UpdateApiKeyResponse, 'data'> & { data?: Maybe<_RefType['APIKey']> } ) | ( Omit<UpdateUserResponse, 'data'> & { data?: Maybe<_RefType['User']> } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  APIKey: ResolverTypeWrapper<APIKeyModel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChatInput: ResolverTypeWrapper<ChatInput>;
  CreateAPIKeyResponse: ResolverTypeWrapper<Omit<CreateApiKeyResponse, 'data'> & { data?: Maybe<ResolversTypes['APIKey']> }>;
  CreateTokenResponse: ResolverTypeWrapper<CreateTokenResponse>;
  CreateUserResponse: ResolverTypeWrapper<Omit<CreateUserResponse, 'data'> & { data?: Maybe<ResolversTypes['User']> }>;
  DeleteUserResponse: ResolverTypeWrapper<DeleteUserResponse>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GroupingKey: GroupingKey;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  KeyValue: ResolverTypeWrapper<KeyValue>;
  Kind: Kind;
  MessageInput: ResolverTypeWrapper<MessageInput>;
  Mutation: ResolverTypeWrapper<{}>;
  MutationResponse: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['MutationResponse']>;
  NullTime: ResolverTypeWrapper<NullTime>;
  Query: ResolverTypeWrapper<{}>;
  RevokeAPIKeyResponse: ResolverTypeWrapper<RevokeApiKeyResponse>;
  Span: ResolverTypeWrapper<Span>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Trace: ResolverTypeWrapper<Trace>;
  UpdateAPIKeyResponse: ResolverTypeWrapper<Omit<UpdateApiKeyResponse, 'data'> & { data?: Maybe<ResolversTypes['APIKey']> }>;
  UpdateUserResponse: ResolverTypeWrapper<Omit<UpdateUserResponse, 'data'> & { data?: Maybe<ResolversTypes['User']> }>;
  UsageResult: ResolverTypeWrapper<UsageResult>;
  User: ResolverTypeWrapper<UserModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  APIKey: APIKeyModel;
  Boolean: Scalars['Boolean']['output'];
  ChatInput: ChatInput;
  CreateAPIKeyResponse: Omit<CreateApiKeyResponse, 'data'> & { data?: Maybe<ResolversParentTypes['APIKey']> };
  CreateTokenResponse: CreateTokenResponse;
  CreateUserResponse: Omit<CreateUserResponse, 'data'> & { data?: Maybe<ResolversParentTypes['User']> };
  DeleteUserResponse: DeleteUserResponse;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  KeyValue: KeyValue;
  MessageInput: MessageInput;
  Mutation: {};
  MutationResponse: ResolversInterfaceTypes<ResolversParentTypes>['MutationResponse'];
  NullTime: NullTime;
  Query: {};
  RevokeAPIKeyResponse: RevokeApiKeyResponse;
  Span: Span;
  String: Scalars['String']['output'];
  Trace: Trace;
  UpdateAPIKeyResponse: Omit<UpdateApiKeyResponse, 'data'> & { data?: Maybe<ResolversParentTypes['APIKey']> };
  UpdateUserResponse: Omit<UpdateUserResponse, 'data'> & { data?: Maybe<ResolversParentTypes['User']> };
  UsageResult: UsageResult;
  User: UserModel;
};

export type ApiKeyResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['APIKey'] = ResolversParentTypes['APIKey']> = {
  api_key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChatInputResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['ChatInput'] = ResolversParentTypes['ChatInput']> = {
  logprobs?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<ResolversTypes['MessageInput']>>, ParentType, ContextType>;
  model?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  n?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  stream?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  temperature?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  top_logprobs?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  top_p?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateApiKeyResponseResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['CreateAPIKeyResponse'] = ResolversParentTypes['CreateAPIKeyResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['APIKey']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTokenResponseResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['CreateTokenResponse'] = ResolversParentTypes['CreateTokenResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserResponseResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['CreateUserResponse'] = ResolversParentTypes['CreateUserResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteUserResponseResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['DeleteUserResponse'] = ResolversParentTypes['DeleteUserResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KeyValueResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['KeyValue'] = ResolversParentTypes['KeyValue']> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageInputResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['MessageInput'] = ResolversParentTypes['MessageInput']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAPIKey?: Resolver<ResolversTypes['CreateAPIKeyResponse'], ParentType, ContextType, Partial<MutationCreateApiKeyArgs>>;
  createUser?: Resolver<ResolversTypes['CreateUserResponse'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'email' | 'password' | 'username'>>;
  deleteUser?: Resolver<ResolversTypes['DeleteUserResponse'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id' | 'password'>>;
  login?: Resolver<ResolversTypes['CreateTokenResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'identity' | 'password'>>;
  loginWithAPIKey?: Resolver<ResolversTypes['CreateTokenResponse'], ParentType, ContextType, RequireFields<MutationLoginWithApiKeyArgs, 'api_key'>>;
  revokeAPIKey?: Resolver<ResolversTypes['RevokeAPIKeyResponse'], ParentType, ContextType, RequireFields<MutationRevokeApiKeyArgs, 'id'>>;
  updateAPIKey?: Resolver<ResolversTypes['UpdateAPIKeyResponse'], ParentType, ContextType, RequireFields<MutationUpdateApiKeyArgs, 'id'>>;
  updateUser?: Resolver<ResolversTypes['UpdateUserResponse'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id'>>;
};

export type MutationResponseResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['MutationResponse'] = ResolversParentTypes['MutationResponse']> = {
  __resolveType: TypeResolveFn<'CreateAPIKeyResponse' | 'CreateTokenResponse' | 'CreateUserResponse' | 'DeleteUserResponse' | 'RevokeAPIKeyResponse' | 'UpdateAPIKeyResponse' | 'UpdateUserResponse', ParentType, ContextType>;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type NullTimeResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['NullTime'] = ResolversParentTypes['NullTime']> = {
  Time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Valid?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  all_traces?: Resolver<Maybe<Array<ResolversTypes['Trace']>>, ParentType, ContextType>;
  api_keys?: Resolver<Maybe<Array<ResolversTypes['APIKey']>>, ParentType, ContextType>;
  chat_input?: Resolver<Maybe<ResolversTypes['ChatInput']>, ParentType, ContextType, RequireFields<QueryChat_InputArgs, 'span_id'>>;
  completion_usage?: Resolver<Maybe<Array<ResolversTypes['UsageResult']>>, ParentType, ContextType, RequireFields<QueryCompletion_UsageArgs, 'start_time'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  spans?: Resolver<Maybe<Array<ResolversTypes['Span']>>, ParentType, ContextType, RequireFields<QuerySpansArgs, 'trace_id'>>;
  traces?: Resolver<Maybe<Array<ResolversTypes['Trace']>>, ParentType, ContextType, RequireFields<QueryTracesArgs, 'session_id'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
};

export type RevokeApiKeyResponseResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['RevokeAPIKeyResponse'] = ResolversParentTypes['RevokeAPIKeyResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpanResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Span'] = ResolversParentTypes['Span']> = {
  duration?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  end_time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<Array<ResolversTypes['KeyValue']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  start_time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trace_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TraceResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Trace'] = ResolversParentTypes['Trace']> = {
  end_time?: Resolver<ResolversTypes['NullTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  session_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  start_time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateApiKeyResponseResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['UpdateAPIKeyResponse'] = ResolversParentTypes['UpdateAPIKeyResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['APIKey']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateUserResponseResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['UpdateUserResponse'] = ResolversParentTypes['UpdateUserResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsageResultResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['UsageResult'] = ResolversParentTypes['UsageResult']> = {
  date?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  input_tokens?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  model?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  output_tokens?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total_tokens?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  api_keys?: Resolver<Maybe<Array<ResolversTypes['APIKey']>>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = DataSourceContext> = {
  APIKey?: ApiKeyResolvers<ContextType>;
  ChatInput?: ChatInputResolvers<ContextType>;
  CreateAPIKeyResponse?: CreateApiKeyResponseResolvers<ContextType>;
  CreateTokenResponse?: CreateTokenResponseResolvers<ContextType>;
  CreateUserResponse?: CreateUserResponseResolvers<ContextType>;
  DeleteUserResponse?: DeleteUserResponseResolvers<ContextType>;
  KeyValue?: KeyValueResolvers<ContextType>;
  MessageInput?: MessageInputResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationResponse?: MutationResponseResolvers<ContextType>;
  NullTime?: NullTimeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RevokeAPIKeyResponse?: RevokeApiKeyResponseResolvers<ContextType>;
  Span?: SpanResolvers<ContextType>;
  Trace?: TraceResolvers<ContextType>;
  UpdateAPIKeyResponse?: UpdateApiKeyResponseResolvers<ContextType>;
  UpdateUserResponse?: UpdateUserResponseResolvers<ContextType>;
  UsageResult?: UsageResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

