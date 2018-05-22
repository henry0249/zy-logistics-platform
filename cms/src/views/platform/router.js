import App from './App.vue';
import Org from './Org.vue';
import Setting from './Setting.vue';
import Company from './Company.vue';
import User from './User.vue';

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
  }]
}]
