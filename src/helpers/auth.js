const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'superhiddensecret'

function createToken(payload) {
    return jwt.sign(payload, SECRET)
}

function verifyToken(token) {
    try {
        const decodedToken = jwt.verify(token, SECRET)
        return decodedToken
    } catch (error) {
        console.log(error)
        return false
    }
}

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
    createToken,
    verifyToken,
    hasRights
}