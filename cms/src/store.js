import Vue from 'vue'
import Vuex from 'vuex'
import router from './router' //路由
import ajaxLib from './lib/axios'
const ajax = ajaxLib.ajax;
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {},
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
      if (localStorage.token) {
        state.token = localStorage.token;
      }
      if (localStorage.tokenExp) {
        state.tokenExp = localStorage.tokenExp;
      }
      state.isSys = state.user.isSys || false;
    },
    setUser(state, data) {
      console.log(data);
      localStorage.token = data.token;
      localStorage.tokenExp = data.tokenExp;
      localStorage.company = JSON.stringify(data.company || {});
      localStorage.user = JSON.stringify(data.user || {});
      state.token = data.token;
      state.user = data.user || {};
      state.isSys = state.user.isSys || false;
      state.company = data.company;
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
      if (payload.user.company.length <= 0) {
        $message.show({
          text: `暂为开放个人用户登录此后台系统`,
          icon: 'error',
          color: '#ff5252',
          time: 10000
        });
      } else if (payload.user.company.length === 1) {
        payload.company = payload.user.company[0];
        context.commit('setUser', payload);
        router.replace('/home');
      } else {
        payload.company = payload.user.company[0];
        context.commit('setUser', payload);
        router.replace('/home');
      }
    }
  }
})
export default store
