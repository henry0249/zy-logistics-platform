import App from './App.vue';
import GoodsList from './GoodsList.vue';
import Add from './Add.vue';

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
  }]
}]
