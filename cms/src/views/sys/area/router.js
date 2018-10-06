import App from './App.vue';
import List from './AraeList.vue';
import AreaAdd from './AreaAdd.vue';
// import AreaEdit from './AreaEdit.vue';

export default [{
  path: 'area',
  component: App,
  name:'区域管理',
  redirect: 'area/list',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children:[{
    path:'list',
    name:'地区列表',
    component:List
  },{
    path:'add',
    name:'添加地区',
    component:AreaAdd
  }]
}]
