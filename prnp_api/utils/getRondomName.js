function randomName() {
    var result = ['用户'];
    var n = 10;
    for (var i = 0; i < n; i++) {
        //生成一个0到25的数字
        var ranNum = Math.ceil(Math.random() * 25);
        if (ranNum % 2 == 0) {
            // 偶数就大写
            result.push(String.fromCharCode(65 + ranNum));
        } else {
            result.push(String.fromCharCode(97 + ranNum));
        }
    }
    return result.join('');
}

module.exports = {
    randomName
}