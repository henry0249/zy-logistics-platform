import App from './App.vue';
import FinancialPretrial from './FinancialPretrial.vue';

export default [{
  path: '/settle',
  component: App,
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: 'financialPretrial',
    component: FinancialPretrial
  }]
}]
