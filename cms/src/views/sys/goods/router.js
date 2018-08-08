import App from './App.vue';
import List from './GoodsList.vue';
import Add from './GoodsAdd.vue';
import Edmit from './GoodsEdmit.vue';

export default [{
  path: 'goods',
  component: App,
  redirect: 'goods/list',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children:[{
    path:'list',
    component:List
  },{
    path:'add',
    component:Add
  },{
    path:'edmit/:_id',
    component:Edmit
  }]
}]