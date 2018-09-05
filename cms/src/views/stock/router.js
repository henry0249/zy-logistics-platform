import App from './App.vue';
import StockList from './StockList.vue';
import Edmit from './Edmit.vue';
import Stock from './Stock.vue';

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
    path: 'edmit/:_id',
    component: Edmit
  }]
} ]
