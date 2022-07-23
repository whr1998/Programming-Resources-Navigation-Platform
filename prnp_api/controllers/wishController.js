const mongoose = require('../conf/mongoConf')
let mongoModel = require('../conf/mongoModel')
const moment = require('moment');

// 获取资源
async function getWish(req, res) {
    let { pageSize, currentPage, radioName, userid, wid, aWID } = req.query
    // 默认值
    pageSize = pageSize ? pageSize : 3;
    currentPage = currentPage ? currentPage : 1;
    var total
    if (radioName == "publish") {
        total = await mongoModel.Wish.find({ userid: userid, isValid: "true" }).countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Wish.find({ userid: userid, isValid: "true" }).limit(4).skip(n)
    } else if (radioName == "audit") {
        total = await mongoModel.Wish.find({ userid: userid, isValid: "false" }).countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Wish.find({ userid: userid, isValid: "false" }).limit(4).skip(n)
    } else if (radioName == "reject") {
        total = await mongoModel.Wish.find({ userid: userid, isValid: "reject" }).countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Wish.find({ userid: userid, isValid: "reject" }).limit(4).skip(n)
    } else if (radioName == "all") {
        total = await mongoModel.Wish.find().countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Wish.find().limit(7).skip(n).sort({ _id: -1 })
    } else if (wid) {
        data = await mongoModel.Wish.find({ _id: wid })
        await mongoModel.Wish.findOneAndUpdate({ _id: wid }, { $inc: { browse: 1 } })
    } else if (aWID) {
        data = await mongoModel.Wish.find({ _id: aWID })
    } else {
        total = await mongoModel.Wish.find({ isValid: true }).countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Wish.find({ isValid: true }).limit(12).skip(n).sort({ _id: -1 })
    }
    res.send({ total, data })
}
// 发布心愿
async function pubWish(req, res) {
    let { userid, tag_list, wish } = req.body

    var new_tag_list = []
    for (var i = 0; i < tag_list.length; i++) {
        new_tag_list.push({
            tag: tag_list[i]
        })
    }
    var user = await mongoModel.Admin.find({ _id: userid })
    var wishData = {
        content: wish.content,
        tag_list: new_tag_list,
        publishDate: moment().format('YYYY-MM-DD HH:mm'),
        userid: userid,
        username: user[0].username,
        toux: user[0].toux
    }
    await mongoModel.Wish.insertMany(wishData)
    var data = {
        code: 200,
        msg: "发布成功，待审核通过即可展示！"
    }
    res.send({ data })
}

// 审核心愿
async function checkWish(req, res) {
    var wish = req.body.wish
    var _id = wish._id
    var isValid = wish.isValid
    await mongoModel.Wish.updateOne({ _id: _id }, { $set: { isValid: isValid } })
    var data = {
        code: 200,
        msg: '资源审核成功'
    }
    res.send({ data })
}

// 拒绝和删除资源
async function rejectWish(req, res) {
    var { status, _id, params } = req.body
    var data
    if (status == "reject") {
        await mongoModel.Wish.findByIdAndUpdate({ _id: _id }, { isValid: status })
        data = {
            code: 200,
            msg: '资源已被拒绝发布'
        }
    }
    if (status == "delete") {
        await mongoModel.Wish.findByIdAndDelete(_id)
        data = {
            code: 200,
            msg: '资源删除成功'
        }
    }
    if (status == "mulDelete") {
        await mongoModel.Wish.deleteMany({ _id: { $in: params } })
        console.log("LLl")
        data = {
            code: 200,
            msg: '资源批量删除成功'
        }
    }

    res.send({ data })
}

// 发布文章
async function pubArticle(req, res) {
    let { userid, article } = req.body
    var user = await mongoModel.Admin.find({ _id: userid })
    var articleData = {
        title: article.title,
        content: article.content,
        date: moment().format('YYYY-MM-DD HH:mm'),
        userid: userid,
        username: user[0].username,
        toux: user[0].toux
    }
    await mongoModel.Article.insertMany(articleData)
    var data = {
        code: 200,
        msg: "发布成功，待审核通过即可展示！"
    }
    res.send({ data })
}

// 获取文章
async function getArticle(req, res) {
    let { pageSize, currentPage, radioName, userid, aid, aWID } = req.query
    // 默认值
    pageSize = pageSize ? pageSize : 3;
    currentPage = currentPage ? currentPage : 1;
    var total
    if (aid) {
        data = await mongoModel.Article.find({ _id: aid })
    } else if (radioName == 'all') {
        total = await mongoModel.Article.find().countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Article.find().sort({ _id: -1 })
    } else if (aWID) {
        data = await mongoModel.Article.find({ _id: aWID })
    } else {
        data = await mongoModel.Article.find({ isValid: 'true' }).sort({ _id: -1 })
    }
    res.send({ total, data })
}
// 审核文章
async function checkArticle(req, res) {
    var article = req.body.article
    var _id = article._id
    var isValid = article.isValid
    await mongoModel.Article.updateOne({ _id: _id }, { $set: { isValid: isValid } })
    var data = {
        code: 200,
        msg: '资源审核成功'
    }
    res.send({ data })
}

// 拒绝和删除文章
async function rejectArticle(req, res) {
    var { status, _id, params } = req.body
    var data
    if (status == "reject") {
        await mongoModel.Article.findByIdAndUpdate({ _id: _id }, { isValid: status })
        data = {
            code: 200,
            msg: '资源已被拒绝发布'
        }
    }
    if (status == "delete") {
        await mongoModel.Article.findByIdAndDelete(_id)
        data = {
            code: 200,
            msg: '资源删除成功'
        }
    }
    if (status == "mulDelete") {
        await mongoModel.Article.deleteMany({ _id: { $in: params } })
        data = {
            code: 200,
            msg: '资源批量删除成功'
        }
    }

    res.send({ data })
}

module.exports = {
    getWish,
    pubWish,
    checkWish,
    rejectWish,
    pubArticle,
    getArticle,
    checkArticle,
    rejectArticle
}