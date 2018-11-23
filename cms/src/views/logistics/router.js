import App from './App.vue';
import TransportTrains from './TransportTrains.vue';

export default [{
  path: '/logistics',
  component: App,
  name: '物流单管理',
  redirect: '/logistics/transport_trains',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: '/logistics/transport_trains',
    component: TransportTrains,
    name: '新增物流单',
    meta: {
      nav: true,
      desc: '此处可根据物流节点,进行【新增物流单】或【修改未通过审核的物流单】进行配送',
    },
    children: [{
      path: '/logistics/transport_trains/edit/:_id',
      component: TransportTrains,
      name: '物流节点详情'
    }]
  }, {
    path: '/logistics/dispatcher_manager',
    component: TransportTrains,
    name: '调度经理审核运单',
    meta: {
      nav: true,
      desc: '调度专员新增物流单之后,调度经理可在此审核',
    }
  }, {
    path: '/logistics/logistics_clerk',
    component: TransportTrains,
    name: '物流文员审核运单',
    meta: {
      nav: true,
      desc: '调度经理审核物流单后,物流文员可在此审核',
    }
  }, {
    path: '/logistics/list',
    component: TransportTrains,
    name: '物流单列表',
    meta: {
      nav: true,
      desc: '此处是已通过审核的物流单,可进行动态运输信息的编辑',
    }
  }]
}]
