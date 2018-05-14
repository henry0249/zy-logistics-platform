import App from './App.vue';
import Platform from './Platform.vue';
import PlatformSetting from './PlatformSetting.vue';
import Company from './Company.vue';
import User from './User.vue';

export default [{
  path: '/org',
  component: App,
  children: [{
    path: 'platform',
    component: Platform
  },{
    path: 'platform_setting',
    component: PlatformSetting
  }, {
    path: 'company',
    component: Company
  }, {
    path: 'User',
    component: User
  }]
}]
