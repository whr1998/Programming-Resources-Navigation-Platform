const { JsonWebTokenError } = require("jsonwebtoken")
const jwt = require("../utils/jwt")

// JsonWebToken 基本配置

module.exports = {
    secretKey: "PRNP_Made_By_WuHairong",
    expiresIn: 24 * 60 * 60
}
