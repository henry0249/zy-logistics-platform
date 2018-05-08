import App from './App.vue';
import Index from './Index.vue';
import Platform from './Platform.vue';
import Company from './Company.vue';
import User from './User.vue';

export default [{
  path: '/organizationa',
  redirect: '/organizationa/index',
  component: App,
  meta: {
    keepAlive: true, // 需要被缓存
  },
  children: [{
    path: 'index',
    component: Platform,
    // meta: {
    //   keepAlive: true, // 需要被缓存
    // },
  },{
    path: 'company',
    component: Company
  },{
    path: 'user',
    component: User
  }]
}]
