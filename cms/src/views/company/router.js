import App from './App.vue';
import Edit from './Edit.vue';
import Account from './CompanyAccount.vue';
import CompanyRole from './CompanyRole.vue';
import CompanyShip from './CompanyShip.vue';
import CompanyAccountChange from './CompanyAccountChange.vue';
import RelationCode from './RelationCode.vue';
import CompanyInvoice from './CompanyInvoice.vue';
import CompanyAccountEdit from './CompanyAccountEdit.vue';

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
      path: 'account_edit/:_id',
      name: '修改',
      component: CompanyAccountEdit
    },{
      path: 'account_change',
      name: '付款单',
      component: CompanyAccountChange
    },{
      path: 'invoice',
      name: '开发票',
      component: CompanyInvoice
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
