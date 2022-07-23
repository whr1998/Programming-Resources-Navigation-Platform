var express = require('express');
var router = express.Router();

let commonController = require('../controllers/commonController')

// 首页图片路由
router.get('/', commonController.getHomePageIcon);

// 修改首页图片路由
router.post('/changeHomePageIcon', commonController.changeHomePageIcon);

// 获取标签
router.get('/getTags', commonController.getTags)

// 获取侧边栏专区
router.get('/getZone', commonController.getZone)

// 获取积分记录
router.get('/getIntegration', commonController.getIntegration)


module.exports = router;