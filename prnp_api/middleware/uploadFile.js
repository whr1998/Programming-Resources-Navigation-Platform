const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path')
let mongoModel = require('../conf/mongoModel')
const moment = require('moment');

async function uploadFiles(req, res) {
    var user = await mongoModel.Admin.find({ _id: req.query.userid })
    //读取路径
    fs.readFile(req.file.path, (err, data) => {
        //读取失败，说明没有上传成功
        if (err) { return res.send('上传失败') }
        //如果读取成功
        //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        let extname, keepname
        var filePath, mimetype = req.file.mimetype
        switch (mimetype) {
            case 'text/plain':
                extname = 'txt'
                keepname = time + '.' + extname
                filePath = 'docs/' + keepname
                break
            case 'application/msword':
                extname = 'doc'
                keepname = time + '.' + extname
                filePath = 'docs/' + keepname
                break
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                extname = 'docx'
                keepname = time + '.' + extname
                filePath = 'docs/' + keepname
                break
            case 'application/pdf':
                extname = mimetype.split('/')[1]
                keepname = time + '.' + extname
                filePath = 'docs/' + keepname
                break
            case 'application/vnd.ms-powerpoint':
                extname = 'ppt'
                keepname = time + '.' + extname
                filePath = 'powerpoints/' + keepname
                break
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                extname = 'pptx'
                keepname = time + '.' + extname
                filePath = 'powerpoints/' + keepname
                break;
            case 'application/vnd.ms-excel':
                extname = 'xls'
                keepname = time + '.' + extname
                filePath = 'excels/' + keepname
                break
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                extname = 'xlsx'
                keepname = time + '.' + extname
                filePath = 'excels/' + keepname
                break
            case 'audio/mpeg':
                extname = 'mp3'
                keepname = time + '.' + extname
                filePath = 'mp3/' + keepname
                break;
            case 'video/mp4':
                extname = mimetype.split('/')[1]
                keepname = time + '.' + extname
                filePath = 'mp4/' + keepname
                break;
            default:
                return res.send({ code: 1, msg: '不支持此类型的文件' })
        }
        //1.图片的绝对路径 2.写入的内容 3.回调函数
        fs.writeFile(path.join(__dirname, '../public/' + filePath), data, (err) => {
            if (err) { return res.send({ code: 0, msg: '上传失败' }) }
            console.log(user)
            let uploadFileData = {
                name: req.file.originalname,
                size: req.file.size,
                uploadDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                path: filePath,
                userid: user[0]._id,
                username: user[0].username
            }
            mongoModel.File.insertMany(uploadFileData)
            res.send({ code: 200, msg: '上传ok', data: filePath })
        });
    });
}

module.exports = {
    uploadFiles
}