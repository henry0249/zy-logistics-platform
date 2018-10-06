import App from './App.vue';
import SystemSysSalesman from './SystemSysSalesman.vue';
import SysDispatcher from './SysDispatcher.vue';

export default [{
  path: 'system',
  component: App,
  name: '系统管理',
  redirect: 'system/sys_saleman',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: 'sys_saleman',
    name: '系统业务员',
    component: SystemSysSalesman
  }, {
    path: 'sys_dispatcher',
    name: '系统调度员',
    component: SysDispatcher
  }]
}]
