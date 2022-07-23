// mongoose 基本配置

let mongoose = require('mongoose')
let url = "mongodb://localhost:27017/prnp"
mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
module.exports = mongoose