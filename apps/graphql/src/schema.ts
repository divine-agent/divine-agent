import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    "Fetch a specific user by id"
    user(id: ID!): User!
  }

  type Mutation {
    createAPIKey: CreateAPIKeyResponse!
    revokeAPIKey(id: ID!): RevokeAPIKeyResponse!
  }

  "MutationResponse is a response to a mutation"
  interface MutationResponse {
    code: Int!
    message: String!
    success: Boolean!
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

  "CreateAPIKeyResponse is a response to the createAPIKey mutation"
  type CreateAPIKeyResponse implements MutationResponse {
    code: Int!
    message: String!
    success: Boolean!
    data: APIKey
  }

  "RevokeAPIKeyResponse is a response to the revokeAPIKey mutation"
  type RevokeAPIKeyResponse implements MutationResponse {
    code: Int!
    message: String!
    success: Boolean!
  }
`;
