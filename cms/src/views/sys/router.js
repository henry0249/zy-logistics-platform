import App from './App.vue';
import Area from './area/router';
import Goods from './goods/router';
import System from './system/router';
import Company from './company/router';
import User from './user/router';

export default [{
  path: '/sys',
  component: App,
  redirect: '/sys/area',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [
    ...Goods,
    ...System,
    ...Company,
    ...User,
    ...Area
  ]
}]
