import App from './App.vue';
import List from './AraeList.vue';
import AreaAdd from './AreaAdd.vue';
import AreaEdmit from './AreaEdmit.vue';

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
  },{
    path:'add',
    component:AreaAdd
  },{
    path:'edmit/:_id',
    component:AreaEdmit
  }]
}]
