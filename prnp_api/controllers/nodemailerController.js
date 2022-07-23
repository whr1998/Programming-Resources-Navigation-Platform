const mongoose = require('../conf/mongoConf')
let mongoModel = require('../conf/mongoModel')
let nodemail = require('../utils/nodemailer')
let getRandom = require('../utils/getRandom')

// 获取验证码
async function getyzm(req, res) {
    let { mail } = req.query;
    var date = new Date();//获取当前时间
    var isLive
    var code = getRandom.createSixNum()
    const result = await mongoModel.Admin.find({ usermail: mail, isLive: true })
    var resData
    if (result.length > 0) {
        resData = {
            msg: "该邮箱已注册!",
            code: "1"
        }
    } else {
        var email = {
            // 发件人
            from: 'xiaojidong1998@163.com',
            // 主题
            subject: 'PRNP注册验证码',//邮箱主题
            // 收件人
            to: mail,//前台传过来的邮箱
            // 邮件内容，HTML格式
            text: '[PRNP] 验证码：' + code + '，请在10分钟内完成验证。此验证码仅用于PRNP用户注册，切勿泄露，谨防被骗。如非本人操作，请忽略本邮件。'//发送验证码
        };
        await nodemail(email);//发送邮件
        resData = {
            msg: "验证码已发送至指定邮箱",
            code: '2',
            yzm: code
        }
    }
    res.send(resData)
}

module.exports = {
    getyzm
}