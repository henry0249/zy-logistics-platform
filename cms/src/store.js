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
    platformPower: {
      owner: false,
      admin: false,
      salesman: false,
      auditor: false,
      dispatcher: false,
      documentClerk: false,
      financial: false
    },
    companyPower: {
      owner: false,
      admin: false,
      salesman: false,
      auditor: false,
      documentClerk: false,
      financial: false
    },

    token: '',
    tokenExp: '',
    baseUrl: window.location.protocol + '//' + window.location.host,
  },
  mutations: {
    setLoginInfo(state, data) {
      state.loginInfo = data || {};
      let user = data.user;
      function setPower(data, stateData) {
        for (let powerKey in stateData) {
          let powerItem = data[powerKey];
          if (typeof powerItem === 'string') {
            stateData[powerKey] = user._id === powerItem;
          } else {
            if (powerItem instanceof Array) {
              powerItem.forEach(item => {
                if (item === user._id) {
                  stateData[powerKey] = true;
                }
              });
            }
          }
          if (user.isSys) {
            stateData[powerKey] = true;
          }
        }
      }
      setPower(data.platform || {}, state.platformPower);
      setPower(data.company || {}, state.companyPower);
      state.login = true;
    },
    setField(state, data) {
      state.field = data || {};
    },
    setOrderBadge(state, data) {
      state.orderBadge = data || {};
    },
    setToken(state, data) {
      console.log('设置了token'+JSON.stringify(data));
      if (data.token && data.exp) {
        localStorage.token = data.token;
        localStorage.tokenExp = data.exp;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExp');
      }
      state.token = data.token;
      state.tokenExp = data.exp;
    },
    getLocalToken(state) {
      state.token = localStorage.token;
      state.tokenExp = localStorage.tokenExp;
    },
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExp');
      for (const powerKey in state.platformPower) {
        state.platformPower[powerKey] = false;
      }
      for (const powerKey in state.companyPower) {
        state.companyPower[powerKey] = false;
      }
      state.token = '';
      state.tokenExp = '';
      state.user = {};
      state.platform = {};
      state.company = {};
      state.isSys = false;
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
    },
    async addPlatform(context, payload) {
      let res = await ajax.post('/platform/set', {
        name: payload.name,
        vd: {
          name: payload.name
        }
      });
      context.commit('setPlatform', res);
    }
  }
})
export default store
