import App from './App.vue';
import List from './UserList.vue';
import UserAdd from './UserAdd.vue';
import UserEdmit from './UserEdmit.vue';

export default [{
  path: 'user',
  component: App,
  redirect: 'user/list',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children:[{
    path:'list',
    component:List
  },{
    path:'add',
    component:UserAdd
  },{
    path:'edit/:_id',
    component:UserEdmit
  }]
}]
