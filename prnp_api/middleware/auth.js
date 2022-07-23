const jwt = require('jsonwebtoken')
const { secretKey } = require('../conf/jwtConf')

// jwt有效性校验
class Auth {
    static verifyToken(token) {
        try {
            jwt.verify(token, secretKey)
            return true
        } catch (e) {
            return false
        }
    }
}

module.exports = Auth