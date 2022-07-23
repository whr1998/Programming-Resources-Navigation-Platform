const svgCaptcha = require('svg-captcha');

// 生成验证码
async function getCaptcha (req, res) {
    //create()创建字符验证码；createMathExpr()创建数学验证码
    const { data, text } = svgCaptcha.create({
        size: 4, //验证码长度
        fontSize: 60, //验证码字号
        noise: 3, //干扰线条数目
        width: 100, //宽度
        height: 40, //高度
        ignoreChars: "luv0o1i",//排除字符
        color: false, //验证码字符是否有颜色，默认是没有，但是如果设置了背景颜色，那么默认就是有字符颜色
        background: '#ccc' //beijing
    })
    res.send({ data, text })
}

module.exports = {
    getCaptcha
}