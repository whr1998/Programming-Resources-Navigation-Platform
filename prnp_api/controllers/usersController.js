const mongoose = require('../conf/mongoConf')
let mongoModel = require('../conf/mongoModel')

const { generateToken } = require('../utils/jwt')
const getRondomName = require('../utils/getRondomName')

const moment = require('moment');

async function test(req, res) {
    const data = await mongoModel.Admin.find()
    res.send(data)
}

// 用户注册实现
async function register(req, res) {
    let { usermail, password } = req.body
    var nowDate = moment().format('YYYY-MM-DD HH:mm:ss')
    var defaultName = getRondomName.randomName()
    await mongoModel.Admin.create(
        {
            usermail: usermail,
            password: password,
            username: defaultName,
            isLive: true,
            regDate: nowDate
        }
    )
    var data = {
        code: 200,
        msg: "注册成功，即将跳转登录页进行登录。"
    }
    res.send(data)
}

// 用户登录实现
async function login(req, res) {
    let { usermail, password } = req.body
    var data
    await mongoModel.Admin.find({ usermail: usermail, password: password }, (err, docs) => {
        if (err) {
            data = {
                err: err
            }
            console.log(err)
        } else {
            if (docs.length > 0) {
                var uid = docs[0].usermail + docs[0].password
                const token = generateToken(uid)
                const userid = docs[0]._id
                const username = docs[0].username
                data = {
                    code: 200,
                    msg: "登录成功，即将跳转进入PRNP首页。",
                    token: token,
                    userid: userid,
                    username: username
                }
            } else {
                data = {
                    code: 404,
                    msg: "登录失败，请确认账户密码是否输入正确。"
                }
            }
        }
    })
    res.send(data)
}

// 获取个人信息
async function getUserInfo(req, res) {
    let { userid, pageSize, currentPage, zone } = req.query
    // 默认值
    pageSize = pageSize ? pageSize : 3;
    currentPage = currentPage ? currentPage : 1;
    let total
    var data
    if (userid) {
        data = await mongoModel.Admin.find({ _id: userid })
    } else if (zone == "all") {
        total = await mongoModel.Admin.find().countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Admin.find()
    } else {
        // 排行榜
        data = await mongoModel.Admin.find({}, ['username', 'integration', 'toux']).collation({ "locale": "zh", numericOrdering: true }).sort('-integration').limit(10)
        console.log(data)
    }
    res.send({ data, total })
}

// 修改个人信息
async function editUserInfo(req, res) {
    let { userid, info, interest } = req.body
    var newInterest = []
    for (var i = 0; i < interest.length; i++) {
        newInterest.push({
            tag: interest[i]
        })
    }
    info['interest'] = newInterest
    await mongoModel.Admin.findByIdAndUpdate(userid, info)
    await mongoModel.Wish.updateMany({ userid: info._id }, { $set: { toux: info.toux, username: info.username } })
    await mongoModel.Comment.updateMany({ userid: info._id }, { $set: { toux: info.toux, username: info.username } })
    await mongoModel.Comment.updateMany({ 'reply.userid': info._id }, { $set: { 'reply.$.toux': info.toux, 'reply.$.username': info.username, } })
    var data = {
        code: 200,
        msg: '修改成功啦！',
    }
    res.send({ data })
}



module.exports = {
    test, register, login, getUserInfo, editUserInfo
}