import App from './App.vue';
import Create from './Create.vue';

import Taking from './Taking.vue';
import TakingEdit from './TakingEdit.vue';

import BeforeDispatchCheck from './BeforeDispatchCheck';
import BeforeDispatchCheckEdit from './BeforeDispatchCheckEdit';

import DistributionFinishCheck from './DistributionFinishCheck';
import DistributionFinishCheckEdit from './DistributionFinishCheckEdit';

import BeforeSettleCheck from './BeforeSettleCheck';
import BeforeSettleCheckEdit from './BeforeSettleCheckEdit';

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
    path: '/edit/beforeDispatchCheck/:_id',
    component: BeforeDispatchCheckEdit,
  }, {
    path: 'distributionFinishCheck',
    component: DistributionFinishCheck,
  }, {
    path: '/edit/distributionFinishCheck/:_id',
    component: DistributionFinishCheckEdit,
  }, {
    path: 'beforeSettleCheck',
    component: BeforeSettleCheck,
  }, {
    path: '/edit/beforeSettleCheck/:_id',
    component: BeforeSettleCheckEdit,
  }, {
    path: '/edit/:_id',
    component: Edit,
  }]
}]
