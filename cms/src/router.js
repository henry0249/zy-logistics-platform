import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  base: '/zylp/',
  mode: 'history',
  routes: (docs => {
    let res = []
    docs.keys().forEach(item => {
      res.push(...docs(item).default)
    })
    res.push({
      path: '*',
      redirect: '/notfound'
    })
    return res
  })(require.context('./views', true, /router\.js$/))
})

function whiteList(path, list = []) {
  let flag = false
  list.forEach((item) => {
    if (path === item) {
      flag = true
    }
  })
  return flag
}

// router.beforeEach((to, from, next) => {
//   if (whiteList(to.path) || localStorage.token || to.meta.pass) { // 判断是否有token
//     next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
//   } else {
//     let query = {
//       to: to.path,
//       ...to.query
//     }
//     next({
//       path: '/login',
//       query: query
//     }); // 否则全部重定向到登录页
//   }
// });

export default router
