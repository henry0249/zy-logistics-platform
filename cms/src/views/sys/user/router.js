import App from './App.vue';
import List from './UserList.vue';
import UserAdd from './UserAdd.vue';
import UserEdit from './UserEdit.vue';

export default [{
  path: 'user',
  component: App,
  name:'用户管理',
  redirect: 'user/list',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children:[{
    path:'list',
    name:'用户列表',
    component:List
  },{
    path:'add',
    name:'添加用户',
    component:UserAdd
  },{
    path:'edit/:_id',
    name:'用户详情',
    component:UserEdit
  }]
}]
