import App from './App.vue';
import List from './CompanyList.vue';
import Edit from './CompanyEdit.vue';
import CompanyAdd from './CompanyAdd.vue';
import CompanyAccount from './CompanyAccount.vue';

export default [{
  path: 'company',
  component: App,
  name: '公司管理',
  redirect: 'company/list',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
    path: 'list',
    name: '公司列表',
    component: List,
    children: [{
      path: 'edit/:_id',
      name: '公司详情',
      component: Edit,
      children:[]
    }, ]
  }, {
    path: 'account',
    name: '账户管理',
    component: CompanyAccount
  }, {
    path: 'add',
    name: '添加公司',
    component: CompanyAdd
  }]
}]
