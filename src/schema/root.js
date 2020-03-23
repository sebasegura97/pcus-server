// Aqui se incluyen los tipos compartidos
const { gql } = require("apollo-server");

export const typeDefs = gql`
  # Need Query and Mutation type to extends among others schema files
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }

  type Error {
    path: String!
    message: String
  }

  # QUERY ORDERING:

  input OrderInput {
    field: String!
    method: OrderMethods!
  }

  enum OrderMethods {
    asc
    desc
  }
`;
