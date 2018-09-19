import App from './App.vue';
import LogisticsAdd from './LogisticsAdd.vue';
import LogisticsList from './LogisticsList.vue';
import LogisticsEdmit from './LogisticsEdmit.vue';
import Test from './Test.vue';

export default [{
  path: '/logistics',
  redirect: '/logistics/list',
  component: App,
  children: [
    {
      path: 'add',
      component: LogisticsAdd
    },
    {
      path: 'list',
      component: LogisticsList
    },
    {
      path: 'test',
      component: Test
    },
    {
      path: 'edit/:_id',
      component: LogisticsEdmit
    }
  ]
}]
