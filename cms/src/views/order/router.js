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
    path: 'create',
    component: Create,
    name: '订单计划',
  }, {
    path: 'taking',
    component: Taking,
    name: '待接单'
  }, {
    path: 'taking/edit/:_id',
    component: TakingEdit,
    name: '详情处理',
  }, {
    path: 'beforeDispatchCheck',
    component: BeforeDispatchCheck,
    name: '调度前审核'
  },{
    path: 'beforeDispatchCheck/edit/:_id',
    component: BeforeDispatchCheckEdit,
    name: '详情处理',
  }, {
    path: 'distributionFinishCheck',
    component: DistributionFinishCheck,
    name: '配送完成审核',
    children: [{
      path: 'edit/:_id',
      component: DistributionFinishCheckEdit,
      name: '详情处理',
    }]
  }, {
    path: 'beforeSettleCheck',
    component: BeforeSettleCheck,
    name: '结算前审核',
    children: [{
      path: '/edit/:_id',
      component: BeforeSettleCheckEdit,
      name: '详情处理',
    }]
  }, {
    path: '/edit/:_id',
    component: Edit,
  }]
}]
