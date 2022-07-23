// mongoose 模型

let mongoose = require('./mongoConf')

// 用户集合
const Admin = mongoose.model('Admin', new mongoose.Schema({
    username: { type: String }, // 用户名
    usermail: { type: String }, // 用户邮箱
    intro: { type: String },
    interest: [
        {
            tag: String, // 兴趣
        }
    ],
    toux: { type: String }, //头像
    area: { type: String }, // 地区
    password: { type: String }, // 密码
    regDate: { type: String }, // 注册日期
    isLive: { type: Boolean, default: false }, // 是否可用
    integration: { type: String, default: "0" }, // 积分
    collect_list: [
        { resourceId: String }
    ]
}))

// 首页图片集合
const HomePage = mongoose.model('HomePage', new mongoose.Schema({
    imgName: { type: String }, // 本地图片名称
    url: { type: String }, // 网站链接
    website: { type: String }, // 网站名称
}))

// 标签集合
const Tag = mongoose.model('Tag', new mongoose.Schema({
    tag_name: { type: String },
    tag_type: { type: String },
    tag_no: { type: String }
}))

// 侧边专区集合
const Zone = mongoose.model('Zone', new mongoose.Schema({
    zindex: { type: String },
    icon: { type: String },
    menuName: { type: String },
    page: { type: String },
    children: [
        {
            path: String,
            name: String,
        }
    ],
    hasChildren: { type: Boolean },
}))

// 资源集合
const Resource = mongoose.model('Resource', new mongoose.Schema({
    icon: { type: String },
    userid: { type: String }, // 推荐用户的id
    name: { type: String },
    intro: { type: String },
    link: { type: String },
    detail: { type: String }, // 可为空
    tag_list: [
        {
            tag: String,
        }
    ],
    shareDate: { type: String },
    isValid: { type: String, default: false }, // 是否有效 默认无效
    isIntegrate: { type: String, default: false },
    zoneid_list: [
        {
            zoneid: String, // 审核后添加
        }
    ],
}))

// 积分集合
const Integration = mongoose.model('Integration', new mongoose.Schema({
    integration: { type: String }, // 积分
    title: { type: String }, // 积分标题
    getDate: { type: String }, // 积分获取时间
    userid: { type: String }, // 获取积分的id
}))

// 心愿集合
const Wish = mongoose.model('Wish', new mongoose.Schema({
    content: { type: String }, // 内容
    tag_list: [
        {
            tag: String, // 标签
        }
    ],
    browse: { type: Number, default: 1 }, // 浏览量
    publishDate: { type: String }, // 心愿发布时间
    userid: { type: String },
    username: { type: String },
    toux: { type: String }, //头像
    isValid: { type: String, default: "false" }
}))

// 评论表
const Comment = mongoose.model('Comment', new mongoose.Schema({
    content: { type: String }, // 内容
    userid: { type: String }, // 用户id
    username: { type: String }, // 用户名
    toux: { type: String }, // 头像
    cDate: { type: String }, // 评论日期
    zone: { type: String }, // resource? wish?
    oid: { type: String },
    reply: [
        {
            content: { type: String },
            userid: { type: String },
            username: { type: String },
            toux: { type: String },
            cDate: { type: String },
            oid: { type: String },
        }
    ]
}))

// 文件表
const File = mongoose.model('File', new mongoose.Schema({
    userid: { type: String },
    username: { type: String },
    name: { type: String }, // 文件名
    size: { type: Number }, // 文件大小
    uploadDate: { type: String }, // 上传时间
    path: { type: String }, // 文件路径
    isValid: { type: String, default: "false" }
}))

// 文章表
const Article = mongoose.model('Article', new mongoose.Schema({
    userid: { type: String },
    username: { type: String },
    date: { type: String },
    title: { type: String },
    content: { type: String },
    isValid: { type: String, default: "false" },
    toux: { type: String }, // 头像
}))


module.exports = {
    Admin,
    HomePage,
    Tag,
    Zone,
    Resource,
    Integration,
    Wish,
    Comment,
    File,
    Article
}