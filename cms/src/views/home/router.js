import App from './App.vue';
import Index from './Index.vue';

export default [{
  path: '/',
  redirect: '/login'
}, {
  path: '/home',
  redirect: '/home/index',
  component: App,
  meta: {
    keepAlive: true, // 需要被缓存
  },
  children: [{
    path: 'index',
    component: Index,
    meta: {
      keepAlive: true // 需要被缓存
    },
  }]
}]
