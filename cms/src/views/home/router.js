import App from './App.vue';

export default [{
  path: '/home',
  component: App,
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: []
}]
