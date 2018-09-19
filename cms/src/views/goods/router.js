import App from './App.vue';
import GoodsList from './GoodsList.vue';
import Add from './Add.vue';
import GoodsBrand from './GoodsBrand.vue';
import BrandEdit from './BrandEdit.vue';
import GoodsCategory from './GoodsCategory.vue';
import CategoryAdd from './CategoryAdd.vue';
import CategoryEdit from './CategoryEdit.vue';
import Edit from './Edit.vue';
import brandAdd from './brandAdd.vue';

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
    path: 'category_edit/:_id',
    component: CategoryEdit
  },{
    path: 'brand',
    component: GoodsBrand
  },{
    path: 'brand_add',
    component: brandAdd
  },{
    path: 'brand_edit/:_id',
    component: BrandEdit
  },{
    path: 'edit/:_id',
    component: Edit
  }]
}]
