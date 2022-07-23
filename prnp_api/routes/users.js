var express = require('express');
var router = express.Router();

let usersController = require('../controllers/usersController')

/* GET users listing. */
router.get('/', usersController.test);

// 用户注册路由
router.post('/register', usersController.register)

// 用户登录路由
router.post('/login', usersController.login)

// 用户信息路由
router.get('/getUserInfo', usersController.getUserInfo)

// 修改用户信息路由
router.post('/editUserInfo', usersController.editUserInfo)


module.exports = router;
