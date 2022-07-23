var express = require('express');
var router = express.Router();

let resourceController = require('../controllers/resourceController')

// 获取资源
router.get('/getResources', resourceController.getResources);
// 获取资源
router.get('/getAllResources', resourceController.getAllResources);

// 获取相似资源
router.get('/getAlikeResource', resourceController.getAlikeResource);

// 推荐资源
router.post('/upResources', resourceController.upResources);

// 审核资源
router.post('/checkResources', resourceController.checkResources);

// 拒绝和删除资源
router.post('/rejectResource', resourceController.rejectResource);


module.exports = router;
