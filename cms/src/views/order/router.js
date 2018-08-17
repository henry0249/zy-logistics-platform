import App from './App.vue';
import Create from './Create.vue';
import Taking from './Taking.vue';
import TakingEdit from './TakingEdit.vue';
import BeforeDispatchCheck from './BeforeDispatchCheck';
import Distribution from './Distribution.vue';
import DistributionEdit from './DistributionEdit.vue';
import All from './All.vue';
import Edit from './Edit.vue';

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
    path: '/edit/taking/:_id',
    component: TakingEdit,
  }, {
    path: 'beforeDispatchCheck',
    component: BeforeDispatchCheck,
  }, {
    path: 'beforeDispatchCheck',
    component: Distribution,
  }, {
    path: '/edit/distribution/:_id',
    component: DistributionEdit,
  }, {
    path: 'all',
    component: All,
  }, {
    path: '/edit/:_id',
    component: Edit,
  }]
}]
