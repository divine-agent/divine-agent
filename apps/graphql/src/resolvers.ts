import type {
  ErrorResponse,
  FetchResponse,
  MutationResponse,
} from '@/types/response';
import type { Resolvers } from '@/types/types';
import type { GraphQLError } from 'graphql';

export const resolvers: Resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      return (await dataSources.authAPI.getUser(id)).data;
    },
  },
  Mutation: {
    createAPIKey: async (_, _args, { dataSources }) => {
      return await mutationAdaptor(dataSources.authAPI.createAPIKey());
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
      return await mutationAdaptor(dataSources.authAPI.updateUser(id, name));
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
