import App from './App.vue';
import List from './GoodsList.vue';
import Add from './GoodsAdd.vue';
import Edmit from './GoodsEdmit.vue';
import GoodsBrand from './GoodsBrand.vue';
import GoodsBrandAdd from './GoodsBrandAdd.vue';
import GoodsBrandEdmit from './GoodsBrandEdmit.vue';
import GoodsCategory from './GoodsCategory.vue';
import GoodsCategoryAdd from './GoodsCategoryAdd.vue';
import GoodsCategoryEdmit from './GoodsCategoryEdmit.vue';

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
    path:'category',
    component:GoodsCategory
  },{
    path:'category_add',
    component:GoodsCategoryAdd
  },{
    path:'category_edmit/:_id',
    component:GoodsCategoryEdmit
  },{
    path:'brand',
    component:GoodsBrand
  },{
    path:'brand_add',
    component:GoodsBrandAdd
  },{
    path:'brand_edmit/:_id',
    component:GoodsBrandEdmit
  },{
    path:'edmit/:_id',
    component:Edmit
  }]
}]
