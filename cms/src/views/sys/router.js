import App from './App.vue';
import Area from './Area.vue';

export default [{
  path: '/sys',
  component: App,
  redirect: '/sys/area',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: 'area',
    component: Area,
  }]
}]
