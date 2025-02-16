import type { Resolvers } from "./types";
import type { ErrorResponse, FetchResponse, MutationResponse } from "./models";
import type { GraphQLError } from "graphql";

export const resolvers: Resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      return (await dataSources.authAPI.getUser(id)).data;
    },
  },
  Mutation: {
    createAPIKey: async (_, args, { dataSources }) => {
      return await mutationAdaptor(dataSources.authAPI.createAPIKey());
    },
  },
  User: {
    api_keys: async (user, args, { dataSources }) => {
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
  f: Promise<FetchResponse<T>>,
): Promise<MutationResponse<T | null>> {
  return f
    .then((response) => {
      return {
        ...response,
        code: 200,
        success: true,
      };
    })
    .catch((error: GraphQLError) => {
      const response = error.extensions.response as ErrorResponse;
      return {
        code: response.status,
        success: false,
        message: response.body.message,
        data: null,
      };
    });
}
