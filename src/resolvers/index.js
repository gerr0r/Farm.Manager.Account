const db = require('../db/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'superhiddensecret'

function hasRights(token, accountRole) {
    try {
        const { id, role } = jwt.verify(token, SECRET)
        if (role !== accountRole) return false
        return id
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    Query: {
        async getPending(parent, args, context) {
            const { token } = context
            if (!hasRights(token, 'master')) throw new Error('Unauthorized')
            return await db.Account.findAll({ where: { active: false } })
        },

        async login(parent, args, context) {
            const account = await db.Account.findOne({ where: { email: args.email } })
            if (!account) throw new Error("Account not found")

            const validPassword = await bcrypt.compare(args.password, account.password)
            if (!validPassword) throw new Error("Wrong password")
            if (!account.active) throw new Error("Account is not active")

            const token = jwt.sign({ id: account.id, role: account.role }, SECRET)

            return {
                token,
                account
            }
        }
    },

    Mutation: {
        async register(parent, args, context) { // all new users
            const password = await bcrypt.hash(args.password, 10)
            // transaction required to prevent changing updatedAt field even on fail
            const transaction = await db.sequelize.transaction()
            try {
                await db.Account.create({
                    email: args.email,
                    password
                }, { transaction })
                await transaction.commit()
                return "Account created. Please wait for aproval"
            } catch (error) {
                await transaction.rollback()
                console.error(error)
                if (error.parent.code === '23505') return "Registration failed: Email already in use"
                return false
            }
        },
        async activate(parent, args, context) { // master only
            const { token } = context
            if (!hasRights(token, 'master')) throw new Error('Unauthorized')

            await db.Account.update({ active: true }, {
                where: { id: args.id }
            })
            return true
        },

        async addUser(parent, args, context) { // farm admin account only
            const { token } = context
            const adminId = hasRights(token, 'admin')
            if (!adminId) throw new Error('Unauthorized')
            // transaction required to prevent changing updatedAt field even on fail
            const password = await bcrypt.hash(args.password, 10)
            const transaction = await db.sequelize.transaction()
            try {
                await db.Account.create({
                    email: args.email,
                    password,
                    role: 'user',
                    admin_id: adminId,
                    active: true
                }, { transaction })
                await transaction.commit()
                return "User added to account."
            } catch (error) {
                await transaction.rollback()
                console.error(error)
                if (error.parent.code === '23505') return "Registration failed: User already in use"
                return false
            }
        }
    },

    Account: {
        __resolveReference(account, { fetchAccountById }) {
            return fetchAccountById(account.id)
        }
    }
}