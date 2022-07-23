var ws = require("nodejs-websocket");
var moment = require('moment');
console.log("开始建立连接...")
let users = [];
let conns = {};

function boardcast(obj) {
    if (obj.bridge && obj.bridge.length) {
        obj.bridge.forEach(item => {
            conns[item].sendText(JSON.stringify(obj));
        })
        return;
    }
    server.connections.forEach((conn, index) => {
        conn.sendText(JSON.stringify(obj));
    })
}
var server = ws.createServer(function (conn) {
    conn.on("text", function (obj) {
        obj = JSON.parse(obj);
        conns['' + obj.uid + ''] = conn;
        switch (obj.type) {
            // 创建连接
            case 1:
                let isuser = users.some(item => {
                    return item.uid === obj.uid, item.username === obj.username
                })
                if (!isuser) {
                    users.push({
                        uid: obj.uid,
                        username: obj.username,
                        status: 1
                    });
                } else {
                    users.map((item, index) => {
                        if (item.uid === obj.uid) {
                            item.status = 1;
                        }
                        return item;
                    })
                }
                boardcast({
                    type: 1,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    msg: obj.username + ' ' + '加入聊天室',
                    users: users,
                    uid: obj.uid,
                    username: obj.username,
                    bridge: obj.bridge
                });
                break;
            // 注销
            case 2:
                // delete conns[''+obj.uid+''];
                users.map((item, index) => {
                    if (item.uid === obj.uid) {
                        item.status = 0;
                    }
                    return item;
                })
                boardcast({
                    type: 1,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    msg: obj.uid + ' ' + '退出了聊天室',
                    users: users,
                    uid: obj.uid,
                    username: obj.username,
                    bridge: []
                });
                break;
            default:
                boardcast({
                    type: 2,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    msg: obj.msg,
                    uid: obj.uid,
                    username: obj.username,
                    bridge: obj.bridge,
                    status: 1
                });
                break;
        }
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(5000)
console.log("WebSocket建立完毕")