const { ApolloServer } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')

const typeDefs = require('./src/type-definitions')
const resolvers = require('./src/resolvers')

const db = require('./src/db/models')

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ctx => { return { token: ctx.req.headers.authorization } }
})

const PORT = process.env.SERVER_PORT || 4001

server.listen(PORT).then(async ({url}) => {
    console.log(`Server ready at ${url}`)
    try {
        await db.sequelize.authenticate()
        console.log('Connection to database successful')
    } catch (error) {
        console.log(error)
    }
})