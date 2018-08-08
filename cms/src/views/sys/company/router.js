import App from './App.vue';
import List from './CompanyList.vue';
import Edmit from './CompanyEdmit.vue';

export default [{
  path: 'company',
  component: App,
  redirect: 'company/list',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children:[{
    path:'list',
    component:List
  },{
    path:'edmit/:_id',
    component:Edmit
  }]
}]
