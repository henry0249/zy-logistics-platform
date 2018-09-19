import App from './App.vue';
import List from './GoodsList.vue';
import Add from './GoodsAdd.vue';
import Edit from './GoodsEdit.vue';
import GoodsBrand from './GoodsBrand.vue';
import GoodsBrandAdd from './GoodsBrandAdd.vue';
import GoodsBrandEdit from './GoodsBrandEdit.vue';
import GoodsCategory from './GoodsCategory.vue';
import GoodsCategoryAdd from './GoodsCategoryAdd.vue';
import GoodsCategoryEdit from './GoodsCategoryEdit.vue';

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
    path:'category_edit/:_id',
    component:GoodsCategoryEdit
  },{
    path:'brand',
    component:GoodsBrand
  },{
    path:'brand_add',
    component:GoodsBrandAdd
  },{
    path:'brand_edit/:_id',
    component:GoodsBrandEdit
  },{
    path:'edit/:_id',
    component:Edit
  }]
}]
