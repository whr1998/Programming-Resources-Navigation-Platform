const mongoose = require('../conf/mongoConf')
let mongoModel = require('../conf/mongoModel')
const moment = require('moment');

// 评论
async function pubComment(req, res) {
    let { userid, commentContent, zone, oid } = req.body
    console.log(zone)
    var user = await mongoModel.Admin.find({ _id: userid })
    var commentData = {
        content: commentContent.content,
        cDate: moment().format('YYYY-MM-DD HH:mm'),
        userid: userid,
        username: user[0].username,
        toux: user[0].toux,
        zone: zone,
        oid: oid
    }
    if (zone == "resource") {
        await mongoModel.Comment.insertMany(commentData)
    } else if (zone == "reply") {
        await mongoModel.Comment.updateOne({ _id: oid }, {
            $push: {
                reply: commentData
            }
        })
    }
    var data = {
        code: 200,
        msg: "评论成功！"
    }
    res.send({ data })
}

// 获取评论列表
async function getComment(req, res) {
    let { pageSize, currentPage, zone, oid } = req.query
    // 默认值
    pageSize = pageSize ? pageSize : 3;
    currentPage = currentPage ? currentPage : 1;
    var total, data
    if (zone == "resource") {
        data = await mongoModel.Comment.find({ oid: oid }).sort({ _id: -1 })
    }
    res.send({ total, data })
}

module.exports = {
    pubComment,
    getComment
}