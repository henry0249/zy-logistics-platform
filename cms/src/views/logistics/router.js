import App from './App.vue';
import LogisticsAdd from './LogisticsAdd.vue';

export default [{
  path: '/logistics',
  redirect: '/logistics/add',
  component: App,
  children: [{
    path: 'add',
    component: LogisticsAdd
  }]
}]
