const { gql } = require('apollo-server')

module.exports = gql`
  type Account @key(fields: "id") {
    id: ID!
    countries: [AccountCountry]
    email: String
    role: String
    createdAt: String
  }

  extend type Query {
    account(id: ID): Account
    inactiveAccounts: [Account]
    activeAccounts: [Account]
    verify: Account
    login(email: String, password: String): Login
  }

  extend type Mutation {
    register(email: String, password: String): String
    activate(id: ID!): Account
    deactivate(id: ID!): Account
    addUser(email: String, password: String): String
    addAssignment(accountId: ID!, countryCode: String!): AccountCountry
    removeAssignment(accountId: ID!, countryCode: String!): AccountCountry
  }

  type Login {
    token: String
    account: Account
  }

  type AccountCountry {
    # countryCode: ID
    country: Country
  }

  extend type Country @key(fields: "code") {
    code: ID @external
  }
`