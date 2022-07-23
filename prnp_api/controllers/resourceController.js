const mongoose = require('../conf/mongoConf')
let mongoModel = require('../conf/mongoModel')
let checkAlike = require('../utils/checkAlike')
const moment = require('moment');

// 获取资源
async function getResources(req, res) {
    let { zoneid, rid, useridInRecord, radioName, pageSize, currentPage, page, keyword } = req.query
    // 默认值
    pageSize = pageSize ? pageSize : 3;
    currentPage = currentPage ? currentPage : 1;
    var data
    let total
    // 获取对应专区的资源数据
    if (zoneid) {
        total = await mongoModel.Resource.find({
            zoneid_list: { $elemMatch: { zoneid: zoneid } }, isValid: "true"
        }).countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Resource.find({
            zoneid_list: { $elemMatch: { zoneid: zoneid } }, isValid: "true"
        }).sort({ _id: -1 }).limit(12).skip(n)
    } else if (rid) {  // 根据资源id查找资源详情
        data = await mongoModel.Resource.find({ _id: rid })
        var userid = data[0].userid
        var userInfo = await mongoModel.Admin.find({ _id: userid })
        var username = userInfo[0].username
        data.push({
            username: username
        })
    } else if (radioName == "audit") {  // 获取审核中的资源
        total = await mongoModel.Resource.find({ userid: useridInRecord, isValid: "false" }).countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Resource.find({ userid: useridInRecord, isValid: "false" }).sort({ _id: -1 }).limit(4).skip(n)
    } else if (radioName == "publish") {  // 获取已发布的资源
        total = await mongoModel.Resource.find({ userid: useridInRecord, isValid: "true" }).countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Resource.find({ userid: useridInRecord, isValid: "true" }).sort({ _id: -1 }).limit(4).skip(n)
    } else if (radioName == "reject") {  // 获取被拒绝的资源
        total = await mongoModel.Resource.find({ userid: useridInRecord, isValid: "reject" }).countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Resource.find({ userid: useridInRecord, isValid: "reject" }).sort({ _id: -1 }).limit(4).skip(n)
    } else if (radioName == "推荐") {  // 获取mainPage推荐的12条资源
        data = await mongoModel.Resource.find().limit(12)
    } else if (radioName == "最新") {  // 获取mainPage最新的12条资源
        data = await mongoModel.Resource.find().sort({ _id: -1 }).limit(12)
    } else if (radioName) {  // 根据mainpage选择的tag获取资源
        data = await mongoModel.Resource.find({
            tag_list: { $elemMatch: { tag: radioName } }
        }).limit(12)
    } else if (page == "zoneAll") {
        if (keyword) {
            let regexp = new RegExp(keyword, 'i')
            total = await mongoModel.Resource.find({ $or: [{ name: { $regex: regexp } }] }).countDocuments()
            // .sort({ _id: -1 })
            let n = (currentPage - 1) * pageSize;
            data = await mongoModel.Resource.find({ $or: [{ name: { $regex: regexp } }] }).limit(12).skip(n)
        } else {
            total = await mongoModel.Resource.find().countDocuments()
            let n = (currentPage - 1) * pageSize;
            data = await mongoModel.Resource.find().limit(12).skip(n)
        }
    } else {
        total = await mongoModel.Resource.find().countDocuments()
        let n = (currentPage - 1) * pageSize;
        data = await mongoModel.Resource.find().sort({ _id: -1 }).limit(7).skip(n)
    }
    res.send({ total, data })
}

// 获取资源
async function getAllResources(req, res) {
    var data = await mongoModel.Resource.find()
    res.send({ data })
}

// 推荐资源
async function upResources(req, res) {
    var { resource, tag_list } = req.body
    // 修改插入的resources对象
    var re_tag_list = []
    for (var i = 0; i < tag_list.length; i++) {
        re_tag_list.push({
            tag: tag_list[i]
        })
    }
    resource['tag_list'] = re_tag_list
    await mongoModel.Resource.insertMany(resource)
    var data = {
        code: '200',
        msg: "推荐资源成功，等待管理审核。"
    }
    res.send({ data })

}

// 审核资源
async function checkResources(req, res) {
    var resource = req.body.resource
    var isSelected = req.body.isSelected
    var _id = resource._id
    var isValid = resource.isValid
    var zoneid_list = resource.zoneid_list

    var data = await mongoModel.Resource.find({ _id: _id })
    var exist = "false"
    for (var i = 0; i < data[0].tag_list.length; i++) {
        if (data[0].tag_list[i].tag == "精选") {
            exist = "true"
            break
        }
    }
    if (isSelected && exist == "false") {
        // var tag_list = resource.tag_list
        await mongoModel.Resource.updateOne({ _id: _id }, {
            $push: {
                tag_list: { tag: "精选" }
            }
        })
    }

    var re_zoneid_list = []
    for (var i = 0; i < zoneid_list.length; i++) {
        re_zoneid_list.push({
            zoneid: zoneid_list[i]
        })
    }
    // 更新资源状态和信息
    await mongoModel.Resource.updateOne({ _id: _id }, { $set: { zoneid_list: re_zoneid_list, isValid: isValid } }, function (err, docs) {
        if (err) {
            console.log(err)
            return
        }
    })

    var exist = await mongoModel.Resource.find({ _id: _id })
    // 如果本资源没有被添加积分
    if (exist[0].isValid == 'true' && exist[0].isIntegrate == "false") {
        var intergration = {
            integration: '10',
            title: '分享资源《' + resource.name + '》并成功发布',
            getDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            userid: resource.userid
        }
        await mongoModel.Integration.insertMany(intergration)
        await mongoModel.Resource.updateOne({ _id: _id }, { $set: { isIntegrate: "true" } })

        var userinfo = await mongoModel.Admin.find({ _id: resource.userid })
        var intergrationInAdmin = Number(userinfo[0].integration) + 10
        await mongoModel.Admin.updateOne({ _id: resource.userid }, { $set: { integration: intergrationInAdmin } })
    }

    if (exist[0].isValid == 'false' && exist[0].isIntegrate == "false") {
        var intergration = {
            integration: '2',
            title: '分享资源《' + resource.name + '》但未通过审核',
            getDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            userid: resource.userid
        }
        await mongoModel.Integration.insertMany(intergration)
        await mongoModel.Resource.updateOne({ _id: _id }, { $set: { isIntegrate: "true" } })
        var userinfo = await mongoModel.Admin.find({ _id: resource.userid })
        var intergrationInAdmin = Number(userinfo[0].integration) + 2
        await mongoModel.Admin.updateOne({ _id: resource.userid }, { $set: { integration: intergrationInAdmin } })
    }

    var data = {
        code: 200,
        msg: '资源审核成功'
    }

    res.send({ data })
}

// 拒绝和删除资源
async function rejectResource(req, res) {
    var { status, _id, params } = req.body
    var data
    if (status == "reject") {
        await mongoModel.Resource.findByIdAndUpdate({ _id: _id }, { isValid: status })
        data = {
            code: 200,
            msg: '资源已被拒绝发布'
        }
    }
    if (status == "delete") {
        await mongoModel.Resource.findByIdAndDelete(_id)
        data = {
            code: 200,
            msg: '资源删除成功'
        }
    }
    if (status == "mulDelete") {
        await mongoModel.Resource.deleteMany({ _id: { $in: params } })
        data = {
            code: 200,
            msg: '资源批量删除成功'
        }
    }

    res.send({ data })
}

// 获取相似资源
async function getAlikeResource(req, res) {
    let { rid } = req.query
    var resource = await mongoModel.Resource.find({ _id: rid })
    // 组装resourceByTag
    var resourceByTag = []
    for (var i = 0; i < resource[0].tag_list.length; i++) {
        var data = await mongoModel.Resource.find({ 'tag_list.tag': resource[0].tag_list[i].tag })
        for (var j = 0; j < data.length; j++) {
            resourceByTag.push(data[j]);
        }
    }
    var alikeResourceId = [], maxPoint = [];
    for (var i = 0; i < resourceByTag.length; i++) {
        var point = checkAlike.similar(resource[0].intro, resourceByTag[i].intro, 2)
        maxPoint.push({ rid: resourceByTag[i]._id, point: point })
    }
    // 对象去重
    function arr_unique(arr) {
        var hash = {};
        return arr.filter((val) => {
            return hash.hasOwnProperty(typeof val + JSON.stringify(val)) ? false : hash[typeof val + JSON.stringify(val)] = true;
        });
    }
    maxPoint.sort(function (a, b) {
        if (a.point > b.point) {
            return -1;
        } else if (a.point == b.point) {
            return 0;
        } else {
            return 1;
        }
    })
    for (var i = 0; i < maxPoint.length; i++) {
        if (maxPoint[i].point == 100 || maxPoint[i].point == 0) {
            continue
        }
        if (alikeResourceId.length == 3) {
            break;
        }
        alikeResourceId.push({
            _id: maxPoint[i].rid
        })
    }
    var alikeResource = []
    for (var i = 0; i < alikeResourceId.length; i++) {
        var data = await mongoModel.Resource.find(alikeResourceId[i])
        alikeResource.push(data)
    }
    res.send({ alikeResource })
}



module.exports = {
    getResources,
    getAllResources,
    upResources,
    checkResources,
    rejectResource,
    getAlikeResource
}