import App from './App.vue';

import DispatchOrder from './DispatchOrder.vue';
import DispatchEdit from './DispatchEdit.vue';

import Distribution from './Distribution.vue';
import DistributionEdit from './DistributionEdit.vue';


export default [{
  path: '/dispatch',
  component: App,
  redirect: '/dispatch/order',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: 'order',
    component: DispatchOrder,
  }, {
    path: '/edit/dispatch/:_id',
    component: DispatchEdit,
  }, {
    path: 'distribution',
    component: Distribution,
  }, {
    path: '/edit/distribution/:_id',
    component: DistributionEdit,
  }]
}]
