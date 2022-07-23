const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path')
const mongoose = require('../conf/mongoConf')
let mongoModel = require('../conf/mongoModel')
let uploadFile = require('../middleware/uploadFile')
let downloadFile = require('../middleware/downloadFile')

// 系统上传图片的功能 不改了
//上传图片的模板
var multer = require('multer');
//生成的文件放入uploads文件夹下
var upload = multer({ dest: 'uploads/' })
//图片上传必须用post方法
router.post('/img', upload.single('image'), (req, res) => {
    //读取路径（req.file.path）
    fs.readFile(req.file.path, (err, data) => {
        //读取失败，说明没有上传成功
        if (err) { return res.send('上传失败') }
        //如果读取成功
        //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        //拓展名
        let extname = req.file.mimetype.split('/')[1]
        //拼接成图片名
        let keepname = time + '.' + extname
        //三个参数
        //1.图片的绝对路径
        //2.写入的内容
        //3.回调函数
        fs.writeFile(path.join(__dirname, '../public/images/' + keepname), data, (err) => {
            if (err) { return res.send({ code: 0, msg: '上传失败' }) }
            res.send({ code: 200, msg: '上传ok', data: keepname })
        });
    });
})

// 上传接口
router.post('/uploadFiles', upload.single('files'), uploadFile.uploadFiles)

// 下载接口
router.get('/downloadFile', downloadFile.downloadFiles)

module.exports = router;