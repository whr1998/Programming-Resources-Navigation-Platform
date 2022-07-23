import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

// 方便使用this.$http访问axios实例
import axios from 'axios'

Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:3000/api',
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
