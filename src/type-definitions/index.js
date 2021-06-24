const { gql } = require('apollo-server')

module.exports = gql`
  type Query {
    getPending: [Account]
    login(email: String, password: String): Login
  }

  type Mutation {
    register(email: String, password: String): String
    activate(id: ID!): Boolean
    addUser(email: String, password: String): String
  }

  type Login {
    token: String
    account: Account
  }

  type Account @key(fields: "id") {
    id: ID!
    email: String
  }
`