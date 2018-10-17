import App from './App.vue';
import Dispatcher from './Dispatcher.vue';
import DispatcherManager from './DispatcherManager.vue';
import LogisticsClerk from './LogisticsClerk.vue';
import Logistics from './Logistics.vue';

export default [{
  path: '/dispatch',
  component: App,
  redirect: '/dispatch/dispatcher',
  name: '调度中心',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: '/dispatch/dispatcher',
    component: Dispatcher,
    name: '调度专员调度',
    meta: {
      nav: true,
      desc: '',
      state: 'dispatcher'
    },
    children: [{
      path: '/dispatch/dispatcher/edit/:_id',
      component: Dispatcher,
      name: '调度专员调度订单详情'
    }]
  },{
    path: '/dispatch/dispatcherManager',
    component: DispatcherManager,
    name: '调度经理审核',
    meta: {
      nav: true,
      desc: '',
      state: 'dispatcherManager'
    },
    children: [{
      path: '/dispatch/dispatcherManager/edit/:_id',
      component: DispatcherManager,
      name: '调度经理审核订单详情'
    }]
  },{
    path: '/dispatch/logisticsClerk',
    component: LogisticsClerk,
    name: '物流文员审核',
    meta: {
      nav: true,
      desc: '',
      state: 'logisticsClerk'
    },
    children: [{
      path: '/dispatch/logisticsClerk/edit/:_id',
      component: LogisticsClerk,
      name: '物流文员审核订单详情'
    }]
  },{
    path: '/dispatch/logistics',
    component: Logistics,
    name: '物流单管理',
    meta: {
      nav: true,
      desc: '',
      state: 'logistics'
    },
    children: [{
      path: '/dispatch/logistics/edit/:_id',
      component: Logistics,
      name: '物流单详情'
    }]
  }]
}]
