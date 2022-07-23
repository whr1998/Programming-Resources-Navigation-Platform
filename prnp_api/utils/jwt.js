const jwt = require('jsonwebtoken')
const { secretKey,expiresIn } = require('../conf/jwtConf')
const Auth = require('../middleware/auth')

// 生成token
function generateToken(uid) {
    const token = jwt.sign(
        {
            uid
        },
        secretKey,
        {
            expiresIn
        }
    )
    return token
}

// 校验token
function jwtVerify(token)  {
    const isValid = Auth.verifyToken(token)
    var data
    if(isValid) {
        data = {
            code: 200,
            msg: "",
            verify: isValid
        }
    } else {
        data = {
            code: 401,
            msg: "登录已过期！",
            verify: isValid
        }
    }
    return data
}

module.exports = {
    generateToken,
    jwtVerify
}