// 生成六位随机数

function createSixNum() {
    var Num = "";
    for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}

// 生成十五个随机四位序号
function createFifteenNum() {
    var Num = "00";
    var arr = []
    for (var j = 0; j < 12; j++) {
        for (var i = 0; i < 2; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        arr.push(Num)
        Num = "00"
    }
    return arr
}

module.exports = {
    createSixNum,
    createFifteenNum
}