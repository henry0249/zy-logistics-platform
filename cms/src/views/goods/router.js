import App from './App.vue';
import GoodsList from './GoodsList.vue';

export default [{
  path: '/goods',
  redirect: '/goods/list',
  component: App,
  children: [{
    path: 'list',
    component: GoodsList
  }]
}]
