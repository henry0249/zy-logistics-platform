import App from './App.vue';
import Index from './Index.vue';

export default [{
  path: '/notfound',
  redirect: '/notfound/index',
  component: App,
  meta: {
    keepAlive: true, // 需要被缓存
    pass: true
  },
  children: [{
    path: 'index',
    component: Index,
    meta: {
      keepAlive: true, // 需要被缓存
      pass: true
    },
  }]
}]
