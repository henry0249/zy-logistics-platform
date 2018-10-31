import App from './App.vue';
import Edit from './Edit.vue';
import Account from './Account.vue';
import CompanyRole from './CompanyRole.vue';
import CompanyShip from './CompanyShip.vue';
import AccountChangeType from './AccountChangeType.vue';
import RelationCode from './RelationCode.vue';
import AccountEdmit from './AccountEdmit.vue';
import AccountAdd from './AccountAdd.vue';

export default [{
  path: '/company',
  name: '公司管理',
  redirect: '/company/edit',
  component: App,
  children: [{
    path: 'edit',
    name: '公司信息',
    component: Edit
  }, {
    path: 'account',
    name: '账户管理',
    component: Account,
    children: [{
      path: 'account_change_type',
      name: '付款单',
      component: AccountChangeType
    }, {
      path: 'account_add',
      name: '',
      component: AccountAdd
    }, {
      path: 'account_edmit/:_id',
      name: '流水详情',
      component: AccountEdmit
    }]
  }, {
    path: 'role',
    name: '角色管理',
    component: CompanyRole
  }, {
    path: 'code',
    name: '关联代码',
    component: RelationCode
  }, {
    path: 'ship',
    name: '车船管理',
    component: CompanyShip
  }]
}]
