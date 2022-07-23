var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 引用路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var commonRouter = require('./routes/common');
var utilsRouter = require('./routes/utils');
var resourcesRouter = require('./routes/resource');
var wishRouter = require('./routes/wish');
var commentRouter = require('./routes/comment');
var fileRouter = require('./routes/file');

const { jwtVerify } = require('./utils/jwt')


var app = express();


// 跨域
const cors = require('cors')
app.use(cors())


// http://localhost:3000/upload/img
// 配置静态资源目录 整一个文件夹 通过域名能访问
app.use(express.static(path.join(__dirname, "./public")))
const upload = require('./middleware/upload');
app.use('/upload', upload)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 接口中token有效性校验
// app.use(function (req, res, next) {
//   if (req.url != '/api/utils/getCaptcha' && req.url != '/api/utils/checkMail' && req.url != '/api/homePage' && req.url != '/api/users/login' && req.url != '/api/users/register') {
//     let token = req.headers.token;
//     let result = jwtVerify(token)
//     console.log(result)
//     // 如果考验通过就next，否则就返回登陆信息不正确
//     if (result.code == 401) {
//       res.send(result);
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });


// 注册路由 (暴露给外部使用)
app.use('/api/index', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/common', commonRouter);
app.use('/api/utils', utilsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/wish', wishRouter);
app.use('/api/comment', commentRouter);
app.use('/api/file', fileRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
