import App from './App.vue';
import Org from './Org.vue';
import Setting from './Setting.vue';
import Company from './Company.vue';
import User from './User.vue';
import Area from './Area.vue';
import AreaAdd from './AreaAdd.vue';
import Transfer from './Transfer.vue';
import TransferAdd from './TransferAdd.vue';
import CompanyEdit from './CompanyEdit.vue';
import CompanyAdd from './CompanyAdd.vue';
import UserEdit from './UserEdit.vue';
import UserAdd from './UserAdd.vue';
import UserAccountEdit from './UserAccountEdit.vue';
import Test from './Test.vue';

export default [{
  path: '/platform',
  component: App,
  redirect: '/platform/org',
  children: [{
    path: 'org',
    component: Org
  }, {
    path: 'setting',
    component: Setting
  }, {
    path: 'company',
    component: Company
  }, {
    path: 'user',
    component: User
  }, {
    path: 'area',
    component: Area
  }, {
    path: 'areaAdd',
    component: AreaAdd
  }, {
    path: 'transfer',
    component: Transfer
  }, {
    path: 'transferAdd',
    component: TransferAdd
  }, {
    path: 'company_edit/:_id',
    component: CompanyEdit
  }, {
    path: 'user_edit/:_id',
    component: UserEdit
  }, {
    path: 'company_add',
    component: CompanyAdd
  }, {
    path: 'user_add',
    component: UserAdd
  }, {
    path: 'user_account_edit/:_id',
    component: UserAccountEdit
  }, {
    path: 'test',
    component: Test
  }]
}]
