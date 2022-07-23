const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path')
const mongoose = require('../conf/mongoConf')
let mongoModel = require('../conf/mongoModel')

async function downloadFiles(req, res) {
    var url = req.query.url
    var userid = req.query.userid
    var integration = req.query.integration
    console.log(integration)
    var filePath = '../prnp_api/public/' + url
    var fileName = url.split('/')[1]
    fs.readFile(filePath, async function (isErr, data) {
        if (isErr) {
            res.end("Read file failed!");
            return;
        }
        await mongoModel.Admin.updateOne({ _id: userid }, { $set: { integration: integration } })
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename=' + fileName,
        });
        res.end(data)
    })
}

module.exports = {
    downloadFiles
}