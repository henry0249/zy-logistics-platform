import App from './App.vue';

import DispatchOrder from './DispatchOrder.vue';
import DispatchEdit from './DispatchEdit.vue';

import Distribution from './Distribution.vue';
import DistributionEdit from './DistributionEdit.vue';


export default [{
  path: '/dispatch',
  component: App,
  redirect: '/dispatch/order',
  name:'调度中心',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: 'order',
    component: DispatchOrder,
    name: "待调度订单",
  }, {
    path: 'order/edit/:_id',
    component: DispatchEdit,
    name: "调度处理",
  }, {
    path: 'distribution',
    component: Distribution,
    name: "待配送运单",
  }, {
    path: 'distribution/edit/:_id',
    component: DistributionEdit,
    name: "配送处理",
  }]
}]
