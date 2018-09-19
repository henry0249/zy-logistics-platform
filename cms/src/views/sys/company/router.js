import App from './App.vue';
import List from './CompanyList.vue';
import Edit from './CompanyEdit.vue';
import CompanyAdd from './CompanyAdd.vue';

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
    path:'edit/:_id',
    component:Edit
  },{
    path:'add',
    component:CompanyAdd
  }]
}]
