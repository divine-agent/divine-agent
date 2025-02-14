import type { Resolvers } from "./types";

export const resolvers: Resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      return dataSources.authAPI.getUser(id);
    },
  },
};
