import App from './App.vue';
import FinancialPretrial from './FinancialPretrial.vue';
import FinancialPretrialEdit from './FinancialPretrialEdit.vue';

export default [{
  path: '/settle',
  component: App,
  name:'财务结算',
  redirect: '/settle/financialPretrial',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: 'financialPretrial',
    component: FinancialPretrial,
    name:'订单预审',
  }, {
    path: 'financialPretrial/edit/:_id',
    component: FinancialPretrialEdit,
    name:'详情处理',
  }]
}]
