var express = require('express');
var router = express.Router();

let fileController = require('../controllers/fileController')

// 获取文件路由
router.get('/getFile', fileController.getFile)

// 审核文件路由
router.post('/checkFile', fileController.checkFile)

// 审核文件路由
router.post('/rejectFile', fileController.rejectFile)

module.exports = router;