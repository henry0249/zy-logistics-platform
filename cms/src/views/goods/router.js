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
import Test from './Test.vue';
import TestChild from './TestChild.vue';

export default [{
  path: '/goods',
  redirect: '/goods/list',
  component: App,
  name: '商品管理',
  children: [{
    path: 'list',
    name: '商品列表',
    component: GoodsList,
    children: [{
      path: 'edit/:_id',
      name: '商品详情',
      component: Edit
    }]
  }, {
    path: 'test',
    name: 'Test',
    component: Test,
    children:[{
      path:'child',
      component:TestChild
    }]
  }, {
    path: 'add',
    name: '添加商品',
    component: Add
  }, {
    path: 'category',
    name: '分类列表',
    component: GoodsCategory,
    children: [{
      path: 'category_edit/:_id',
      name: '分类详情',
      component: CategoryEdit
    }]
  }, {
    path: 'category_add',
    name: '添加分类',
    component: CategoryAdd
  }, {
    path: 'brand',
    name: '品牌列表',
    component: GoodsBrand,
    children: [{
      path: 'brand_edit/:_id',
      name: '品牌详情',
      component: BrandEdit
    }]
  }, {
    path: 'brand_add',
    name: '添加品牌',
    component: brandAdd
  }]
}]
