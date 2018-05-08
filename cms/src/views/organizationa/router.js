import App from './App.vue';
import Index from './Index.vue';
import Platform from './Platform.vue';
import Company from './Company.vue';
import User from './User.vue';
import Add from './Add.vue';

export default [{
  path: '/organizationa',
  redirect: '/organizationa/platform',
  component: App,
  meta: {
    keepAlive: true, // 需要被缓存
  },
  children: [{
    path: 'index',
    component: Index,
  },{
    path: 'platform',
    name: 'platform',
    component: Platform
  },{
    path: 'company',
    name: 'company',
    component: Company
  },{
    path: 'user',
    name: 'user',
    component: User
  },{
    path: 'add',
    name: 'add',
    component: Add
  }]
}]
