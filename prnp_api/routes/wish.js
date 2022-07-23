var express = require('express');
var router = express.Router();

let wishController = require('../controllers/wishController')

// 获取心愿路由
router.get('/getWish', wishController.getWish);

// 发布心愿路由
router.post('/pubWish', wishController.pubWish);

// 审核心愿路由
router.post('/checkWish', wishController.checkWish);

// 拒绝和删除心愿
router.post('/rejectWish', wishController.rejectWish);

// 发布文章路由
router.post('/pubArticle', wishController.pubArticle);

// 获取文章路由
router.get('/getArticle', wishController.getArticle);

// 审核文章路由
router.post('/checkArticle', wishController.checkArticle);

// 拒绝和删除文章
router.post('/rejectArticle', wishController.rejectArticle);

module.exports = router;