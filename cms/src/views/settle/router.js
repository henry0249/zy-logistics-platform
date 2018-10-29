import App from './App.vue';
import DocumentClerk from './DocumentClerk.vue';
import DocumentClerkManager from './DocumentClerkManager.vue';
import Financial from './Financial.vue';
import Settle from './Settle.vue';
import FinancialManager from './FinancialManager.vue';
import SettleAccount from './SettleAccount.vue';

export default [{
  path: '/settle',
  component: App,
  name: '财务结算',
  redirect: '/settle/documentClerk',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: '/settle/documentClerk',
    component: DocumentClerk,
    name: '单据文员审核',
    meta: {
      state: 'documentClerk',
      nav: true
    },
    children: [{
      path: '/settle/documentClerk/edit/:_id',
      component: DocumentClerk,
      name: '单据文员审核订单详情'
    }]
  }, {
    path: '/settle/documentClerkManager',
    component: DocumentClerkManager,
    name: '单据主管审核',
    meta: {
      state: 'documentClerkManager',
      nav: true
    },
    children: [{
      path: '/settle/documentClerkManager/edit/:_id',
      component: DocumentClerkManager,
      name: '单据主管审核订单详情'
    }]
  }, {
    path: '/settle/financial',
    component: Financial,
    name: '财务文员预审',
    meta: {
      state: 'financial',
      nav: true
    }
  }, {
    path: '/settle/settle',
    component: Settle,
    name: '结算专员结算',
    meta: {
      state: 'settle',
      nav: true
    }
  }, {
    path: '/settle/financialManager',
    component: FinancialManager,
    name: '财务经理审核',
    meta: {
      state: 'dinancialManager',
      nav: true
    }
  }, {
    path: '/settle/account',
    component: SettleAccount,
    name: '结算详情'
  }]
}]
