import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { AuthAPI } from './datasources/auth-api';
import { DataParkAPI } from './datasources/datapark-api';
import { resolvers } from './resolvers';

const typeDefs = gql(
  readFileSync(join(__dirname, './schema.graphql'), { encoding: 'utf-8' })
);

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const { cache } = server;
      return Promise.resolve({
        dataSources: {
          authAPI: new AuthAPI({ token, cache }),
          dataparkAPI: new DataParkAPI({ token, cache }),
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
