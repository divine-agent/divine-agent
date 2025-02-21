import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { AuthAPI } from "./datasources/auth-api";

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const { cache } = server;
      return Promise.resolve({
        dataSources: {
          authAPI: new AuthAPI({ token, cache }),
        },
      });
    },
  });
  console.info(`
    🚀  Server is running!
    📭  Query at ${url}
  `);
}

startApolloServer();
