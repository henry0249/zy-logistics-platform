import Vue from 'vue'
import Vuex from 'vuex'
import router from './router' //路由
import ajaxLib from './lib/axios'

const ajax = ajaxLib.ajax;
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loginInfo: {},
    field: {},
    orderBadge: {},
    baseUrl: window.location.protocol + '//' + window.location.host,
  },
  mutations: {
    setLoginInfo(state, data) {
      state.loginInfo = data || {};
    },
    setField(state, data) {
      state.field = data || {};
    },
    setOrderBadge(state, data) {
      state.orderBadge = data || {};
    },
    setToken(state, data) {
      if (data.token && data.exp) {
        localStorage.token = data.token;
        localStorage.tokenExp = data.exp;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExp');
      }
    },
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExp');
      router.replace('/');
    }
  },
  actions: {
    async getLoginInfo(context, payload) {
      let res = await ajax('/loginInfo');
      context.commit('setLoginInfo', res);
      let fieldRes = await ajax('/field');
      context.commit('setField', fieldRes);
      let orderBadgeRes = await ajax('/order/badge');
      context.commit('setOrderBadge', orderBadgeRes);
    },
    async getField(context, payload) {
      let res = await ajax.get('/field');
      context.commit('setField', res);
    },
    async getOrderBadge(context, payload) {
      let res = await ajax.get('/order/badge');
      context.commit('setOrderBadge', res);
    },
    async orderBadgeNotify(context, payload) {
      let oldBadge = JSON.parse(JSON.stringify(context.state.orderBadge));
      let res = await ajax.get('/order/badge');
      let newBadge = res;
      context.commit('setOrderBadge', res);
      return {
        newBadge,
        oldBadge
      }
    },
    async logout(context) {
      await ajax.get('/logout');
      context.commit('logout');
    }
  }
})
export default store
