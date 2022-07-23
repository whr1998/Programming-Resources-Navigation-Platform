var express = require('express');
var router = express.Router();

let commentController = require('../controllers/commentController')

// 评论
router.post('/pubComment', commentController.pubComment);

// 获取评论
router.get('/getComment', commentController.getComment);

module.exports = router;