const mongoose = require('../conf/mongoConf')
let mongoModel = require('../conf/mongoModel')
let getRandom = require('../utils/getRandom')

// 获取首页图片
async function getHomePageIcon(req, res) {
    const data = await mongoModel.HomePage.find();
    console.log(data)
    res.send(data)
}

// 修改首页图片
async function changeHomePageIcon(req, res) {
    var { homePages, _id } = req.body
    await mongoModel.HomePage.updateOne({ _id: _id }, { $set: { imgName: homePages.imgName, usl: homePages.url, website: homePages.website } })
    data = {
        code: 200,
        msg: '修改成功'
    }
    res.send({ data })
}

// 获取PRNP标签
async function getTags(req, res) {
    let { apiType } = req.query
    let data
    if (apiType === 'all') {
        // 获取全部标签
        data = await mongoModel.Tag.find();
    } else {
        // // 获取随机的十五条标签
        var arr = getRandom.createFifteenNum()
        data = await mongoModel.Tag.find({ tag_no: arr });
    }
    res.send(data)
    console.log(data)
}

// 获取侧边栏分区
async function getZone(req, res) {
    // 获取routelist和routelist2
    let { page } = req.query
    const routelist = await mongoModel.Zone.find({ hasChildren: true, page: page })
    const routelist2 = await mongoModel.Zone.find({ hasChildren: false, page: page })
    res.send({ routelist, routelist2 })
}

// 获取积分记录
async function getIntegration(req, res) {
    let { pageSize, currentPage, userid } = req.query
    pageSize = pageSize ? pageSize : 3;
    currentPage = currentPage ? currentPage : 1;
    total = await mongoModel.Integration.find({ userid: userid }).countDocuments()
    let n = (currentPage - 1) * pageSize;
    data = await mongoModel.Integration.find({ userid: userid }).sort({ _id: -1 }).limit(10).skip(n);
    res.send({ data, total })
}



module.exports = {
    getHomePageIcon,
    getTags,
    getZone,
    getIntegration,
    changeHomePageIcon
}