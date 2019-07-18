import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Users from './components/usersM/Users.vue'
import Welcome from './components/Welcome.vue'
import Rights from './components/rightsM/Rights.vue'
import Roles from './components/rightsM/Roles.vue'
import Goods from './components/goodsM/Goods.vue'
import Categories from './components/goodsM/Categories.vue'
Vue.use(Router)


let router = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
        {
        path: '/roles',
        component: Roles
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/categories',
        component: Categories
      }
    ]
  }]
})
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.path == '/login') return next()
  let tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
