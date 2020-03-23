const { gql } = require("apollo-server");

export const typeDefs = gql`
  extend type Query {
    me: User
    allUsers: [User!]!
    getUser(userId: ID!): User
  }

  extend type Mutation {
    deleteUser(userId: ID!): ID
    updateUser(userId: ID!, update: UserInput!): UserResponse
  }

  type UserResponse {
    user: User
    ok: Boolean!
    message: String
  }

  input UserInput {
    username: String
    email: String
    name: String
    lastname: String
    role: Roles
    password: String
  }

  type User {
    id: Int!
    username: String!
    email: String!
    name: String!
    lastname: String!
    role: Roles!
    password: String
  }

  enum Roles {
    GERENTE
    ADMINISTRATIVO
    VENDEDOR
  }
`;
