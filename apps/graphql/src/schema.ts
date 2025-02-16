import gql from "graphql-tag";

export const typeDefs = gql`
  "Query is a collection of queries that can be made to the API"
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

  "Mutation is a collection of mutations that can be made to the API"
  type Mutation {
    "Auth Mutations"
    login(identity: String!, password: String!): CreateTokenResponse!
    loginWithAPIKey(api_key: String!): CreateTokenResponse!
    "API Key Mutations"
    createAPIKey: CreateAPIKeyResponse!
    revokeAPIKey(id: ID!): RevokeAPIKeyResponse!
  }

  "MutationResponse is a response to a mutation"
  interface MutationResponse {
    code: Int!
    message: String!
    success: Boolean!
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

  "CreateTokenResponse is a response to the login mutation"
  type CreateTokenResponse implements MutationResponse {
    code: Int!
    message: String!
    success: Boolean!
    data: String
  }
`;
