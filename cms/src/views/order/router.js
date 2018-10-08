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
  name: '订单管理',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: '/order/create',
    component: Create,
    name: '订单计划',
    meta: {
      nav: true,
    }
  }, {
    path: '/order/taking',
    component: Taking,
    name: '待接订单',
    meta: {
      nav: true
    }
  }, {
    path: '/order/taking/edit/:_id',
    component: TakingEdit,
    name: '接单处理'
  }, {
    path: '/order/beforeDispatchCheck',
    component: BeforeDispatchCheck,
    name: '待审核订单(调度前)',
    meta: {
      nav: true
    }
  }, {
    path: '/order/beforeDispatchCheck/edit/:_id',
    component: BeforeDispatchCheckEdit,
    name: '调度前审核'
  }, {
    path: '/order/distributionFinishCheck',
    component: DistributionFinishCheck,
    name: '待审核订单(配送完成)',
    meta: {
      nav: true
    }
  }, {
    path: 'd/order/istributionFinishCheck/edit/:_id',
    component: DistributionFinishCheckEdit,
    name: '配送完成审核'
  }, {
    path: '/order/beforeSettleCheck',
    component: BeforeSettleCheck,
    name: '待审核订单(结算前)',
    meta: {
      nav: true
    }
  }, {
    path: '/order/beforeSettleCheck/edit/:_id',
    component: BeforeSettleCheckEdit,
    name: '结算前审核',
  }]
}]
