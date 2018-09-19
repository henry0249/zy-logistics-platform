import App from './App.vue';
import FinancialPretrial from './FinancialPretrial.vue';
import FinancialPretrialEdit from './FinancialPretrialEdit.vue';

export default [{
  path: '/settle',
  component: App,
  redirect: '/settle/financialPretrial',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: 'financialPretrial',
    component: FinancialPretrial
  }, {
    path: '/edit/financialPretrial/:_id',
    component: FinancialPretrialEdit,
  }]
}]
