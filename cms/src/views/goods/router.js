import App from './App.vue';
import GoodsList from './GoodsList.vue';
import Add from './Add.vue';
import GoodsBrand from './GoodsBrand.vue';
import GoodsCategory from './GoodsCategory.vue';
import Edmit from './Edmit.vue';
import test from './test.vue';

export default [{
  path: '/goods',
  redirect: '/goods/list',
  component: App,
  children: [{
    path: 'list',
    component: GoodsList
  },{
    path: 'add',
    component: Add
  },{
    path: 'category/:_id',
    component: GoodsCategory
  },{
    path: 'brand',
    component: GoodsBrand
  },{
    path: 'edmit/:_id',
    component: Edmit
  },{
    path: 'test',
    component: test
  }]
}]
