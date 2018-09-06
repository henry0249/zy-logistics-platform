import App from './App.vue';
import Edmit from './Edmit.vue';

export default [{
  path: '/company',
  redirect: '/company/edmit',
  component: App,
  children: [{
    path: 'edmit',
    component: Edmit
  }]
}]
