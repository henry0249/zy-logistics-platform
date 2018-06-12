import App from './App.vue';
import Org from './Org.vue';
import Setting from './Setting.vue';
import Company from './Company.vue';
import User from './User.vue';
import Area from './Area.vue';
import AreaAdd from './AreaAdd.vue';
import CompanyEdmit from './CompanyEdmit.vue';

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
    path: 'company_edmit/:_id',
    component: CompanyEdmit
  }]
}]
