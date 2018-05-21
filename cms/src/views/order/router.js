import App from './App.vue';
import Create from './Create.vue';
import Taking from './Taking.vue';
import Check from './Check.vue';
import Distribution from './Distribution.vue';
import Dispatch from './Dispatch.vue';
import Settlement from './Settlement.vue';

export default [{
  path: '/order',
  component: App,
  redirect: '/order/create',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: 'create',
    component: Create,
  }, {
    path: 'taking',
    component: Taking,

  }, {
    path: 'check',
    component: Check,

  }, {
    path: 'distribution',
    component: Distribution,

  }, {
    path: 'dispatch',
    component: Dispatch,

  }, {
    path: 'settlement',
    component: Settlement,
  }]
}]
