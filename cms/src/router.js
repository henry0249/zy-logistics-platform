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
    });
    res.push({
      path: '*',
      redirect: '/notfound'
    });
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

export default router
