import Index from './Index.vue';
import Login from './Login.vue';
import LoginPsw from './LoginPsw.vue';
import Reg from './Reg.vue';
import RestPsw from './RestPsw.vue';
import Sys from './SysLogin.vue';

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
    path: 'reg',
    component: Reg,
    meta: {
      pass: true //放行
    }
  }, {
    path: 'sys',
    component: Sys,
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
}]
