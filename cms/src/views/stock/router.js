import App from './App.vue';
import StockList from './StockList.vue';
import Edit from './Edit.vue';
import Stock from './Stock.vue';
import Add from './AddStock.vue';
import StockReadyList from './StockReadyList.vue';

export default [{
  path: '/stock',
  component: App,
  redirect: '/stock/index',
  children: [{
    path: 'index',
    component: Stock
  },{
    path: 'list',
    component: StockList
  },{
    path: 'add',
    component: Add
  },{
    path: 'ready_list',
    component: StockReadyList
  },{
    path: 'edit',
    component: Edit
  }]
} ]
