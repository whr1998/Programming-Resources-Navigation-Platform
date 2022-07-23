const mongoose = require('../conf/mongoConf')
let mongoModel = require('../conf/mongoModel')

async function getFile(req, res) {
    let { pageSize, currentPage, zone, aWID } = req.query

    // 默认值
    pageSize = pageSize ? pageSize : 3;
    currentPage = currentPage ? currentPage : 1;
    var data
    let total
    if (zone == "mainPage") {
        total = await mongoModel.File.find({ isValid: 'true' }).countDocuments();
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.File.find({ isValid: 'true' }).sort({ _id: -1 }).limit(5).skip(n)
    } else if (zone == "all") {
        total = await mongoModel.File.find().countDocuments();
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.File.find().sort({ _id: -1 }).limit(9).skip(n)
    } else if (aWID) {
        data = await mongoModel.File.find({ _id: aWID })
    }
    res.send({ total, data })
}

// 审核文件
async function checkFile(req, res) {
    var file = req.body.file
    console.log(file)
    var _id = file._id
    var isValid = file.isValid
    await mongoModel.File.updateOne({ _id: _id }, { $set: { isValid: isValid } })
    var data = {
        code: 200,
        msg: '文件审核成功'
    }
    res.send({ data })
}

// 拒绝和删除资源
async function rejectFile(req, res) {
    var { status, _id, params } = req.body
    var data
    if (status == "reject") {
        await mongoModel.File.findByIdAndUpdate({ _id: _id }, { isValid: status })
        data = {
            code: 200,
            msg: '资源已被拒绝发布'
        }
    }
    if (status == "delete") {
        await mongoModel.File.findByIdAndDelete(_id)
        data = {
            code: 200,
            msg: '资源删除成功'
        }
    }
    if (status == "mulDelete") {
        await mongoModel.File.deleteMany({ _id: { $in: params } })
        data = {
            code: 200,
            msg: '资源批量删除成功'
        }
    }

    res.send({ data })
}

module.exports = {
    getFile,
    checkFile,
    rejectFile
}