import App from './App.vue';
import Edit from './Edit.vue';
import Account from './Account.vue';
import CompanyRole from './CompanyRole.vue';
import CompanyShip from './CompanyShip.vue';

export default [{
  path: '/company',
    name:'公司管理',
    redirect: '/company/edit',
  component: App,
  children: [{
    path: 'edit',
    name:'公司详情',
    component: Edit
  },{
    path: 'account',
    name:'账户管理',
    component: Account
  },{
    path: 'role',
    name:'角色管理',
    component: CompanyRole
  },{
    path: 'ship',
    name:'车船管理',
    component: CompanyShip
  }]
}]
