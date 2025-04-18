import type {
  ErrorResponse,
  FetchResponse,
  MutationResponse,
} from '@/types/response';
import type { Resolvers } from '@/types/types';
import type { GraphQLError } from 'graphql';

export const resolvers: Resolvers = {
  Query: {
    me: async (_, _args, { dataSources }) => {
      return (await dataSources.authAPI.getCurrentUser()).data;
    },
    user: async (_, { id }, { dataSources }) => {
      return (await dataSources.authAPI.getUser(id)).data;
    },
    api_keys: async (_, _args, { dataSources }) => {
      return (await dataSources.authAPI.getAPIKeys()).data;
    },
    traces: async (_, { session_id }, { dataSources }) => {
      return (await dataSources.dataparkAPI.getTraces(session_id)).data;
    },
    all_traces: async (_, _args, { dataSources }) => {
      return (await dataSources.dataparkAPI.getAllTraces()).data;
    },
    spans: async (_, { trace_id }, { dataSources }) => {
      return (await dataSources.dataparkAPI.getSpans(trace_id)).data;
    },
    chat_input: async (_, { span_id }, { dataSources }) => {
      return (await dataSources.dataparkAPI.getChatInput(span_id)).data;
    },
    completion_usage: async (
      _,
      { start_time, end_time, group_by },
      { dataSources }
    ) => {
      return (
        await dataSources.dataparkAPI.getCompletionUsage(
          start_time,
          end_time ?? undefined,
          group_by ?? undefined
        )
      ).data;
    },
  },
  Mutation: {
    createAPIKey: async (_, { name }, { dataSources }) => {
      return await mutationAdaptor(
        dataSources.authAPI.createAPIKey(name || 'Secret Key')
      );
    },
    updateAPIKey: async (_, { id, name }, { dataSources }) => {
      return await mutationAdaptor(
        dataSources.authAPI.updateAPIKey(id, name || undefined)
      );
    },
    revokeAPIKey: async (_, { id }, { dataSources }) => {
      return await mutationAdaptor(dataSources.authAPI.revokeAPIKey(id));
    },
    login: async (_, { identity, password }, { dataSources }) => {
      return await mutationAdaptor(
        dataSources.authAPI.login(identity, password)
      );
    },
    loginWithAPIKey: async (_, { api_key }, { dataSources }) => {
      return await mutationAdaptor(
        dataSources.authAPI.loginWithAPIKey(api_key)
      );
    },
    deleteUser: async (_, { id, password }, { dataSources }) => {
      return await mutationAdaptor(
        dataSources.authAPI.deleteUser(id, password)
      );
    },
    updateUser: async (_, { id, name }, { dataSources }) => {
      return await mutationAdaptor(
        dataSources.authAPI.updateUser(id, name ?? undefined)
      );
    },
    createUser: async (_, { email, password, username }, { dataSources }) => {
      return await mutationAdaptor(
        dataSources.authAPI.createUser(email, password, username)
      );
    },
  },
  User: {
    api_keys: async (_user, _args, { dataSources }) => {
      return (await dataSources.authAPI.getAPIKeys()).data;
    },
  },
};

/**
 * mutationAdaptor is a utility function that adapts a FetchResponse to a MutationResponse
 * @param { Promise<FetchResponse<T>> } f
 * @returns { MutationResponse<T> }
 */
async function mutationAdaptor<T>(
  f: Promise<FetchResponse<T>>
): Promise<MutationResponse<T | null>> {
  return f
    .then((response): MutationResponse<T> => {
      return {
        ...response,
        code: 200,
        success: true,
      };
    })
    .catch((error: GraphQLError): MutationResponse<null> => {
      const response = error.extensions.response as ErrorResponse;
      // message = response.body if response.body is string else response.body.message
      if (typeof response.body === 'string') {
        response.body = { message: response.body, data: null };
      }
      return {
        code: response.status,
        success: false,
        message: response.body.message,
        data: null,
      };
    });
}
