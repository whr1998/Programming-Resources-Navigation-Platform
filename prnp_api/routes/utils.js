var express = require('express');
var router = express.Router();

let nodemailerController = require('../controllers/nodemailerController')
let captchaUtil = require('../utils/getCaptcha')

// 验证码路由
router.get('/getCaptcha',captchaUtil.getCaptcha)

// 邮件发送路由
router.get('/checkMail',nodemailerController.getyzm)

module.exports = router;
