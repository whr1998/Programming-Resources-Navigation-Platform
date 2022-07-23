import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import login from './login.vue'
import register from './register.vue'

// 审核模块
import ResourceAudit from './views/auditManage/resource'
import wishAudit from './views/auditManage/wish'
import articleAudit from './views/auditManage/article'
import fileAudit from './views/auditManage/file'

// 信息模块
import userList from './views/infoManage/userList'
import homePageList from './views/infoManage/homePageList'
import integrationList from './views/infoManage/integrationList'
import zoneAndTag from './views/infoManage/zoneAndTag'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/register',
      name: 'register',
      component: register,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      redirect: '/resourceAudit',
      children: [
        {
          path: '/resourceAudit',
          name: '资源审核',
          component: ResourceAudit,
        },
        {
          path: '/wishAudit',
          name: '心愿审核',
          component: wishAudit,
        },
        {
          path: '/fileAudit',
          name: '上传文件审核',
          component: fileAudit,
        },
        {
          path: '/articleAudit',
          name: '文章审核',
          component: articleAudit,
        },
        {
          path: '/userList',
          name: '用户列表',
          component: userList,
        },
        {
          path: '/homePageList',
          name: '首页图片列表',
          component: homePageList,
        },
        {
          path: '/integrationList',
          name: '积分列表',
          component: integrationList,
        },
        {
          path: '/zoneAndTag',
          name: '专区与Tag',
          component: zoneAndTag,
        }
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
