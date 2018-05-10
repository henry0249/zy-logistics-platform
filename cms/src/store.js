import Vue from 'vue'
import Vuex from 'vuex'
import router from './router' //路由
import ajaxLib from './lib/axios'
const ajax = ajaxLib.ajax;
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {},
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
      if (localStorage.token) {
        state.token = localStorage.token;
      }
      if (localStorage.tokenExp) {
        state.tokenExp = localStorage.tokenExp;
      }
      if (state.user.role && state.user.role.length > 0) {
        state.user.role.forEach(item => {
          if (item === 'sys') {
            state.isSys = true;
          }
        });
      }
    },
    setUser(state, data) {
      localStorage.token = data.token;
      localStorage.tokenExp = data.tokenExp;
      localStorage.user = JSON.stringify(data.user || {});
      state.token = data.token;
      state.user = data.user || {};
      if (state.user.role && state.user.role.length > 0) {
        state.user.role.forEach(item => {
          if (item === 'sys') {
            state.isSys = true;
          }
        });
      }
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
  }
})
export default store
