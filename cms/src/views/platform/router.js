import App from './App.vue';
import Org from './Org.vue';
import Setting from './Setting.vue';
import Company from './Company.vue';
import User from './User.vue';
import Area from './Area.vue';
import AreaAdd from './AreaAdd.vue';
import Transfer from './Transfer.vue';
import TransferAdd from './TransferAdd.vue';
import CompanyEdmit from './CompanyEdmit.vue';
import CompanyAdd from './CompanyAdd.vue';
import UserEdmit from './UserEdmit.vue';
import UserAdd from './UserAdd.vue';
import UserAccountEdmit from './UserAccountEdmit.vue';
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
    path: 'company_edmit/:_id',
    component: CompanyEdmit
  }, {
    path: 'user_edmit/:_id',
    component: UserEdmit
  }, {
    path: 'company_add',
    component: CompanyAdd
  }, {
    path: 'user_add',
    component: UserAdd
  }, {
    path: 'user_account_edmit/:_id',
    component: UserAccountEdmit
  }, {
    path: 'test',
    component: Test
  }]
}]
