import Vue from 'vue'
import Vuex from 'vuex'
import router from './router' //路由
import ajaxLib from './lib/axios'
import {
  SSL_OP_CIPHER_SERVER_PREFERENCE
} from 'constants';
const ajax = ajaxLib.ajax;
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {},
    platform: {},
    company: {},
    isSys: false,
    token: '',
    tokenExp: '',
    baseUrl: window.location.protocol + '//' + window.location.host,
  },
  mutations: {
    getLocalUser(state) {
      if (localStorage.user) {
        state.user = JSON.parse(localStorage.user);
      }
      if (localStorage.company) {
        state.company = JSON.parse(localStorage.company);
      }
      if (localStorage.platform) {
        state.platform = JSON.parse(localStorage.platform);
      }
      if (localStorage.token) {
        state.token = localStorage.token;
      }
      if (localStorage.tokenExp) {
        state.tokenExp = localStorage.tokenExp;
      }
      state.isSys = state.user.isSys || false;
    },
    setUser(state, data) {
      state.token = data.token;
      state.isSys = state.user.isSys || false;
      state.user = data.user || {};
      state.company = data.company || {};
      state.platform = data.platform || {};

      localStorage.token = data.token;
      localStorage.tokenExp = data.tokenExp;
      localStorage.company = JSON.stringify(state.company);
      localStorage.user = JSON.stringify(state.user);
      localStorage.platform = JSON.stringify(state.platform);
    },
    refleshToken(state, data) {
      localStorage.token = data.refleshtoken;
      localStorage.tokenExp = data.tokenexp;
      state.token = data.refleshToken;
      state.tokenExp = data.tokenExp;
    },
    logout(state) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      state.token = '';
      state.user = {};
      state.isSys = false;
      router.replace('/');
    }
  },
  actions: {
    async getUserInfo(context, payload) {
      let res = await ajax.get('/user')
      if (res) {
        context.commit('setUser', res);
      } else {
        context.commit('setUser', {});
      }
    },
    async logout(context, payload) {
      await ajax.get('/logout');
      context.commit('logout');
    },
    async setUser(context, payload) {
      if (payload.user.isSys) {
        payload.company = payload.user.company[0];
        if (payload.user.platform) {
          payload.platform = payload.user.platform;
        }
        context.commit('setUser', payload);
        $message.success("登录成功");
        router.replace('/home');
      } else {
        if (payload.user.company.length <= 0) {
          $message.show({
            text: `暂为开放个人用户登录此后台系统`,
            icon: 'error',
            color: '#ff5252',
            time: 10000
          });
        }
      }
    }
  }
})
export default store
