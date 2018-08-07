import App from './App.vue';
import List from './AraeList.vue';

export default [{
  path: 'area',
  component: App,
  redirect: 'area/list',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children:[{
    path:'list',
    component:List
  }]
}]
