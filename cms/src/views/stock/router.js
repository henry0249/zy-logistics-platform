import App from './App.vue';
import StockList from './StockList.vue';
import Add from './Add.vue';
import Edmit from './Edmit.vue';

export default [{
  path: '/stock',
  component: App,
  redirect: '/stock/list',
  children: [{
    path: 'list',
    component: StockList
  },{
    path: 'add',
    component: Add
  },{
    path: 'edmit/:_id',
    component: Edmit
  }]
} ]
