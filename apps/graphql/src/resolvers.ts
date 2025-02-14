import type { Resolvers } from "./types";

export const resolvers: Resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      return dataSources.authAPI.getUser(id);
    },
  },
  User: {
    api_keys: async (user, args, { dataSources }) => {
      return dataSources.authAPI.getAPIKeys();
    },
  },
};
