import App from './App.vue';
import SystemSysSalesman from './SystemSysSalesman.vue';
import SysDispatcher from './SysDispatcher.vue';

export default [{
  path: 'system',
  component: App,
  redirect: 'system/sys_saleman',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children:[{
    path:'sys_saleman',
    component:SystemSysSalesman
  },{
    path:'sys_dispatcher',
    component:SysDispatcher
  }]
}]
