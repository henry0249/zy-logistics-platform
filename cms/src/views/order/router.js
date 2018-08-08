import App from './App.vue';
import Create from './Create.vue';
import Taking from './Taking.vue';
import TakingEdit from './TakingEdit.vue';
import DispatchCheck from './DispatchCheck.vue';
import Distribution from './Distribution.vue';
import DistributionEdit from './DistributionEdit.vue';
import Dispatch from './Dispatch.vue';
import DispatchEdit from './DispatchEdit.vue';
import Check from './Check.vue';
import CheckEdit from './CheckEdit.vue';
import FinishCheck from './FinishCheck.vue';
import Finish from './Finish.vue';
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
    path: 'dispatchCheck',
    component: DispatchCheck,
  }, {
    path: 'dispatch',
    component: Dispatch,
  }, {
    path: '/edit/dispatch/:_id',
    component: DispatchEdit,
  }, {
    path: 'distribution',
    component: Distribution,
  }, {
    path: '/edit/distribution/:_id',
    component: DistributionEdit,
  }, {
    path: 'check',
    component: Check,
  }, {
    path: '/edit/check/:_id',
    component: CheckEdit,
  },{
    path: 'finishCheck',
    component: FinishCheck,
  }, {
    path: 'Finish',
    component: Finish,
  }, {
    path: 'all',
    component: All,
  }, {
    path: '/edit/:_id',
    component: Edit,
  }]
}]
