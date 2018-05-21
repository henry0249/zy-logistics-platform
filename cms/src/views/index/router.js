import Index from './Index.vue';
import Login from './Login.vue';
import LoginQuick from './LoginQuick.vue';
import LoginPsw from './LoginPsw.vue';
import Reg from './Reg.vue';
import RestPsw from './RestPsw.vue';
import ChooseCompany from './ChooseCompany.vue';

export default [{
  path: '/',
  redirect: '/login'
}, {
  path: '/index',
  component: Index,
  meta: {
    keepAlive: true, // 需要被缓存
    pass: true //放行
  }
}, {
  path: '/login',
  redirect: '/login/psw',
  component: Login,
  meta: {
    pass: true //放行
  },
  children: [{
    path: 'quick',
    component: LoginQuick,
    meta: {
      pass: true //放行
    }
  }, {
    path: 'reg',
    component: Reg,
    meta: {
      pass: true //放行
    }
  }, {
    path: 'psw',
    component: LoginPsw,
    meta: {
      pass: true //放行
    }
  }, {
    path: 'resetPsw',
    component: RestPsw,
    meta: {
      pass: true //放行
    }
  }]
},{
  path: '/chooseCompany',
  component: ChooseCompany,
  meta: {
    pass: true //放行
  }
}]
