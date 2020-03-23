const { gql } = require("apollo-server");

export const typeDefs = gql`

  extend type Mutation {
    register(
      username: String!
      email: String!
      name: String!
      lastname: String!
      password: String!
      role: Roles!
    ): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    user: User
    errors: [Error!]
  }


`;
