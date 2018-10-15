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
  name: '商品管理',
  redirect: 'goods/list',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: 'list',
    name: '商品列表',
    component: List,
    children: [{
      path: 'edit/:_id',
      name: '商品详情',
      component: Edit
    }]
  }, {
    path: 'add',
    name: '添加商品',
    component: Add
  }, {
    path: 'category',
    name: '分类列表',
    component: GoodsCategory,
    children:[{
      path: 'category_edit/:_id',
      name: '分类详情',
      component: GoodsCategoryEdit,
    }]
  }, {
    path: 'category_add',
    name: '添加分类',
    component: GoodsCategoryAdd
  },  {
    path: 'brand',
    name: '品牌列表',
    component: GoodsBrand,
    children:[{
      path: 'brand_edit/:_id',
      name: '品牌详情',
      component: GoodsBrandEdit
    }]
  }, {
    path: 'brand_add',
    name: '添加品牌',
    component: GoodsBrandAdd
  }]
}]
