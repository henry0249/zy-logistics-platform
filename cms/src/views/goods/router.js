import App from './App.vue';
import GoodsList from './GoodsList.vue';
import Add from './Add.vue';
import GoodsBrand from './GoodsBrand.vue';
import BrandEdmit from './BrandEdmit.vue';
import GoodsCategory from './GoodsCategory.vue';
import CategoryAdd from './CategoryAdd.vue';
import CategoryEdmit from './CategoryEdmit.vue';
import Edmit from './Edmit.vue';
import brandAdd from './brandAdd.vue';
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
    path: 'category',
    component: GoodsCategory
  },{
    path: 'category_add',
    component: CategoryAdd
  },{
    path: 'category_edmit/:_id',
    component: CategoryEdmit
  },{
    path: 'brand',
    component: GoodsBrand
  },{
    path: 'brand_add',
    component: brandAdd
  },{
    path: 'brand_edmit/:_id',
    component: BrandEdmit
  },{
    path: 'edmit/:_id',
    component: Edmit
  },{
    path: 'test',
    component: test
  }]
}]
