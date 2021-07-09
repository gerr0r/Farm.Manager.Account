const { gql } = require('apollo-server')

module.exports = gql`
  type Account @key(fields: "id") {
    id: ID!
    # countries: [AccountCountry]
    email: String
    role: String
    createdAt: String
  }

  extend type Query {
    account(id: ID): Account
    accountUsers: [User]
    accountCountries(accountId: ID): [AccountCountry]
    inactiveAccounts: [Account]
    activeAccounts: [Account]
    userFarms(accountId: ID): [UserFarm]
    verify: Account
    login(email: String, password: String): Login
  }

  extend type Mutation {
    register(email: String, password: String): String
    activate(id: ID!): Account
    deactivate(id: ID!): Account
    addUser(email: String, password: String): User
    setFarmAccess(accountId: ID!, farmId: ID!): UserFarm
    addAssignment(accountId: ID!, countryCode: String!): AccountCountry
    removeAssignment(accountId: ID!, countryCode: String!): AccountCountry
  }

  type User {
    id: ID!
    email: String
    createdAt: String
  }

  type Login {
    token: String
    account: Account
  }

  type AccountCountry {
    country: Country
  }

  type UserFarm {
    farm: Farm
  }

  extend type Country @key(fields: "code") {
    code: ID @external
  }

  extend type Farm @key(fields: "id") {
    id: ID! @external
  }
`