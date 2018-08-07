import App from './App.vue';
import List from './SystemList.vue';

export default [{
  path: 'system',
  component: App,
  redirect: 'system/list',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children:[{
    path:'list',
    component:List
  }]
}]
