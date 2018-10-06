import App from './App.vue';
import Edit from './Edit.vue';

export default [{
  path: '/company',
    name:'公司管理',
    redirect: '/company/edit',
  component: App,
  children: [{
    path: 'edit',
    name:'公司详情',
    component: Edit
  }]
}]
