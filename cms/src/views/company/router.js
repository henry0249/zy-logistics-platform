import App from './App.vue';
import Edit from './Edit.vue';

export default [{
  path: '/company',
  redirect: '/company/edit',
  component: App,
  children: [{
    path: 'edit',
    component: Edit
  }]
}]
