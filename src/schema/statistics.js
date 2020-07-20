// Aqui se incluyen los tipos compartidos
const { gql } = require("apollo-server");

export const typeDefs = gql`
  # Need Query and Mutation type to extends among others schema files
  extend type Query {
    getStatistics(from: String!, to: String): [Statistic!]!
  }

  type Statistic {
    id: ID!
    name: String!
    unit: String!
    valueMoreThan300: String!
    valueLessThan300: String!
    description: String!
  }
`;
