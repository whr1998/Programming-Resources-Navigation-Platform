import Vue from 'vue'
import Router from 'vue-router'

// 登录和注册
import Login from './views/Login.vue'
import Register from './views/Register.vue'

// 项目主页Home
import Home from './views/Home.vue'

// 编程导航主页
import Main from './views/Main.vue'
// 编程导航主页导航栏的主页和资源和社区
import mainPage from './views/main/mainPage.vue'
import resources from './views/main/resouces.vue'
import community from './views/main/community.vue'
import person from './views/main/person.vue'
// 资源路由下的zone路由
import zone from './views/main/resources/common/zone'
import cardDetail from './views/main/resources/common/cardDetail'
import addResources from './views/main/resources/common/addResources'
import addSuccess from './views/main/resources/common/success'

// 社区路由下的
import wish from './views/main/community/wish.vue'
import wishDetail from './views/main/community/wishDetail.vue'

import article from './views/main/community/article.vue'
import articleDetail from './views/main/community/articleDetail.vue'

import chat from './views/main/community/chat.vue'

// 个人中心
import personInfo from './views/main/person/personInfo.vue'
import shareRecord from './views/main/person/shareRecord.vue'
import integration from './views/main/person/integration.vue'
import myWish from './views/main/person/myWish.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    // 项目初始页面：Home
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        // 主页
        {
          path: '/main',
          name: 'mainPage',
          component: mainPage
        },
        // 资源
        {
          path: '/resources',
          name: 'resources',
          component: resources,
          redirect: "/resources/zone",
          meta: {
            requireAuth: true
          },
          children: [
            {
              path: '/resources/zone',
              name: 'zone',
              component: zone,
            },
          ]
        },
        // 卡片详情
        {
          path: '/cardDetail',
          name: 'cardDetail',
          component: cardDetail,
          meta: {
            requireAuth: true
          },
        },
        // 添加资源
        {
          path: '/addResources',
          name: 'addResources',
          component: addResources
        },
        // 添加成功
        {
          path: '/addSuccess',
          name: 'success',
          component: addSuccess
        },
        // 社区
        {
          path: '/community',
          name: 'community',
          component: community,
          redirect: '/community/wish',
          meta: {
            requireAuth: true
          },
          children: [
            {
              path: '/community/wish',
              name: 'wish',
              component: wish,
            },
            {
              path: '/wishDetail',
              name: 'wishDetail',
              component: wishDetail
            },
            {
              path: '/community/article',
              name: 'article',
              component: article
            },
            {
              path: '/articleDetail',
              name: 'articleDetail',
              component: articleDetail
            },
            {
              path: '/community/chat',
              name: 'chat',
              component: chat
            },
          ]
        },

        // 个人中心
        {
          path: '/person',
          name: 'person',
          component: person,
          redirect: '/person/personInfo',
          meta: {
            requireAuth: true
          },
          children: [
            {
              path: '/person/personInfo',
              name: '个人资料',
              component: personInfo,
            },
            {
              path: '/person/shareRecord',
              name: '推荐记录',
              component: shareRecord,
            },
            {
              path: '/person/integration',
              name: '积分记录',
              component: integration,
            },
            {
              path: '/person/mywish',
              name: '我的心愿',
              component: myWish,
            }
          ]
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 判断要进入的路由是否需要登录
  if (to.matched.some(res => res.meta.requireAuth)) {
    let token = localStorage.getItem('TOKEN')
    if (token) {
      next()
    } else {
      next({
        path: '/login', // 未登录则跳转至login页面
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next()
  }

  if (to.fullPath === "/login") {
    if (localStorage.getItem('TOKEN')) {
      next({
        path: from.fullPath
      });
    } else {
      next();
    }
  }

});

export default router
