import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/config.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)



// 方便使用this.$http访问axios实例
import axios from 'axios'

// 请求超时时间
axios.defaults.timeout = 120000

// 添加请求拦截器
// axios.interceptors.request.use(
//   config => {
//     // 在发送请求之前做些什么
//     // 判断是否存在token，如果存在将每个页面header都添加token
//     if (localStorage.getItem("token")) {
//       // 请求头配置全局token
//       config.headers.token = localStorage.getItem("token")
//       console.log(localStorage.getItem('token'))
//     }
//     return config
//   },
//   err => {
//     // 对请求错误做些什么
//     Vue.prototype.$message.error('请求超时')
//     return Promise.reject(err)
//   }
// )


// // 响应拦截器
// axios.interceptors.response.use(
//   response => {
//     // res是响应的结果
//     switch (response.data.code) {
//       case 401:
//         // 登录失效
//         // 响应成功的拦截
//         console.log('响应拦截器：')
//         // console.log(response.data)
//         Vue.prototype.$message.error(response.data.msg)
//         this.$store.dispatch("delete_token");
//         router.push('/login')
//         break
//       // case 404:
//       //   if (response.data.msg !== null) {
//       //     Vue.prototype.$message.error(response.data.msg)
//       //   } else {
//       //     Vue.prototype.$message.error('未知错误')
//       //   }
//       //   break
//       // case 500:
//       //   // 错误
//       //   if (response.data.msg !== null) {
//       //     Vue.prototype.$message.error(response.data.msg)
//       //   } else {
//       //     Vue.prototype.$message.error('未知错误')
//       //   }
//         // break
//       default:
//         return response
//     }
//     return response
//   },
//   err => {
//     if (err.response.data.msg) {
//       Vue.prototype.$message.error(err.response.data.message)
//       return Promise.reject(err.response.data.message) // 返回接口返回的错误信息
//     } else {
//       // 返回状态码不为200时候的错误处理
//       Vue.prototype.$message.error(err.toString())
//       return Promise.resolve(err)
//     }
//   }
// )


Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:3000/api',
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
