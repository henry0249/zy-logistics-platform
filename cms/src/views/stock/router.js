import App from './App.vue';
import StockList from './StockList.vue';
import Edit from './Edit.vue';
import Stock from './Stock.vue';
import Add from './AddStock.vue';
import StockReadyList from './StockReadyList.vue';

export default [{
  path: '/stock',
  component: App,
  redirect: '/stock/home',
  name:'库存管理',
  children: [{
    path: 'home',
    name:'库存主页',
    component: Stock
  },{
    path: 'list',
    name:'库存记录',
    component: StockList
  },{
    path: 'add',
    name:'添加库存',
    component: Add
  },{
    path: 'ready_list',
    name:'待处理库存单',
    component: StockReadyList
  },{
    path: 'edit',
    name:'修改库存单',
    component: Edit
  }]
} ]
