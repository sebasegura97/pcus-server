const { gql } = require("apollo-server");

export const typeDefs = gql`
  extend type Mutation {
    register(
      email: String!
      name: String!
      lastname: String!
      password: String!
      role: Roles!
    ): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
    changeRole(userId: ID!, newRole: Roles!): RegisterResponse!
    deleteUser(userId: ID!): ID
    updateUser(userId: ID!, update: UserInput!): UserResponse
    readNotification(id: ID!): Boolean
    sendChangePasswordEmail(email: String!): Boolean!
    changeUserPassword(userId: ID!, token: String!, newPassword: String!): Boolean!
  }

  extend type Query {
    me: User
    allUsers: [User!]!
    getUser(userId: ID!): User
    getNotifications(readed: Boolean): NotificationResponse
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    message: String
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    user: User
    errors: [Error!]
  }

  type UserResponse {
    user: User
    ok: Boolean!
    message: String
  }

  input UserInput {
    email: String
    name: String
    lastname: String
    role: Roles
    password: String
  }

  type User {
    id: Int!
    email: String!
    name: String!
    lastname: String!
    role: Roles!
    password: String
    createdAt: String
  }

  type NotificationResponse {
    notifications: [Notification]
    totalCount: Int
  }

  type Notification {
    id: ID!
    message: String!
    reason: String!
    readed: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  enum Roles {
    ADMINISTRADOR
    PROPONENTE
    CONTROL_TECNICO
    CONTROL_JURIDICO
  }
`;
