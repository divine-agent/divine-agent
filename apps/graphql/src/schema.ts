import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    "Fetch a specific user by id"
    user(id: ID!): User!
  }

  "User is a registered user of the application"
  type User {
    id: ID!
    username: String!
    email: String!
    api_keys: [APIKey]
  }

  "APIKey is a key used to authenticate requests to the API"
  type APIKey {
    id: ID!
    api_key: String!
  }
`;
