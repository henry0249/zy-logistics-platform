import Vue from 'vue'
import Vuex from 'vuex'
import router from './router' //路由
import ajaxLib from './lib/axios'

const ajax = ajaxLib.ajax;
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    showGlobalHeader: false,
    globalLoading: true,
    roleCompany: [],
    company: {},
    loginInfo: {},
    field: {},
    headerBadge: {},
    baseUrl: window.location.protocol + '//' + window.location.host,
    role: {},
  },
  mutations: {
    headerToggle(state, flag) {
      state.showGlobalHeader = flag;
    },
    globalLoadingToggle(state, flag) {
      state.globalLoading = flag;
    },
    setLoginInfo(state, data) {
      state.loginInfo = data || {};
    },
    setField(state, data) {
      state.field = data || {};
    },
    setCompany(state, data) {
      state.company = data || {};
      localStorage.company = data._id;
    },
    setRoleCompany(state, data) {
      state.roleCompany = data || [];
    },
    setRole(state, data) {
      state.role = data || {};
    },
    setHeaderBadge(state, data) {
      state.headerBadge = data || {};
    },
    setToken(state, data) {
      if (data) {
        localStorage.token = data;
      } else {
        localStorage.removeItem('token');
      }
    },
    logout() {
      localStorage.removeItem('token');
      router.replace('/');
    }
  },
  actions: {
    async getLoginInfo(context, payload) {
      try {
        let res = await ajax('/loginInfo');
        context.commit('setLoginInfo', res);
        let fieldRes = await ajax('/field');
        context.commit('setField', fieldRes);
        let roleCompanyRes = await ajax('/roleCompany');
        context.commit('setRoleCompany', roleCompanyRes);
        if (roleCompanyRes.length > 0) {
          let companyInfo = "";
          roleCompanyRes.forEach(companyItem => {
            if (companyItem._id === localStorage.company) {
              companyInfo = companyItem
            }
          });
          if (!companyInfo) {
            companyInfo = roleCompanyRes[0];
          }
          context.commit('setCompany', companyInfo);
          let roleInfo = await ajax.post('/rolePower', {
            company: companyInfo._id
          });
          context.commit('setRole', roleInfo);
        }
        let headerBadgeRes = await ajax('/badge/header');
        context.commit('setHeaderBadge', headerBadgeRes);
      } catch (error) {
        router.replace('/');
      }
    },
    async getField(context, payload) {
      let res = await ajax.get('/field');
      context.commit('setField', res);
    },
    async getHeaderBadge(context, payload) {
      let res = await ajax.get('/badge/header');
      context.commit('setHeaderBadge', res);
    },
    async getRole(context, payload) {
      let res = await ajax.post('/rolePower', {
        company: payload
      });
      context.commit('setRole', res);
    },
    async headerBadgeNotify(context, payload) {
      let oldBadge = JSON.parse(JSON.stringify(context.state.headerBadge));
      let res = await ajax.get('/badge/header');
      let newBadge = res;
      context.commit('setHeaderBadge', res);
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
