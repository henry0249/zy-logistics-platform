import App from './App.vue';
import Create from './Create.vue';
import Taking from './Taking.vue';
// import TakingEdit from './TakingEdit.vue';
import Check from './Check.vue';
import CheckEdit from './CheckEdit.vue';
import Distribution from './Distribution.vue';
import DistributionEdit from './DistributionEdit.vue';
import Dispatch from './Dispatch.vue';
import DispatchEdit from './DispatchEdit.vue';
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
  }, {
    path: '/edit/taking/:_id',
    // component: TakingEdit,
  }, {
    path: '/edit/dispatch/:_id',
    component: DispatchEdit,
  }, {
    path: '/edit/distribution/:_id',
    component: DistributionEdit,
  }, {
    path: '/edit/check/:_id',
    component: CheckEdit,
  }]
}]
