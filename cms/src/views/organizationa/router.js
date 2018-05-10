import App from './App.vue';
import Platform from './Platform.vue';
import PlatformInit from './PlatformInit.vue';
import Company from './Company.vue';
import User from './User.vue';

export default [{
  path: '/org',
  component: App,
  children: [{
    path: 'platform',
    component: Platform
  },{
    path: 'platform_init',
    component: PlatformInit
  },{
    path: 'company',
    component: Company
  },{
    path: 'User',
    component: User
  }]
}]
