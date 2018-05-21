import Vue from 'vue'
import Vuex from 'vuex'
import router from './router' //路由
import ajaxLib from './lib/axios'
const ajax = ajaxLib.ajax;
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {},
    platform: {},
    platformPower: {
      owner: false,
      admin: false,
      salesman: false,
      auditor: false,
      dispatcher: false,
      documentClerk: false,
      financial: false
    },
    company: {},
    companyPower: {
      owner: false,
      admin: false,
      salesman: false,
      auditor: false,
      documentClerk: false,
      financial: false
    },
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
      if (localStorage.platformPower) {
        state.platformPower = JSON.parse(localStorage.platformPower);
      }
      if (localStorage.companyPower) {
        state.companyPower = JSON.parse(localStorage.companyPower);
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
      localStorage.token = data.token;
      localStorage.tokenExp = data.tokenExp;
      localStorage.user = JSON.stringify(state.user);
    },
    setPlatform(state, data) {
      state.platform = data || {};
      for (const powerKey in state.platformPower) {
        if (data[powerKey] instanceof Array) {
          data[powerKey].forEach(item => {
            if (item === state.user._id) {
              state.platformPower[powerKey] = true;
            }
          });
        }
      }
      localStorage.platform = JSON.stringify(state.platform);
      localStorage.platformPower = JSON.stringify(state.platformPower);
    },
    setCompany(state, data) {
      state.company = data || {};
      for (const powerKey in state.companyPower) {
        if (data[powerKey] instanceof Array) {
          data[powerKey].forEach(item => {
            if (item === state.user._id) {
              state.companyPower[powerKey] = true;
            }
          });
        }
      }
      localStorage.company = JSON.stringify(state.company);
      localStorage.companyPower = JSON.stringify(state.companyPower);
    },
    refleshToken(state, data) {
      localStorage.token = data.refleshtoken;
      localStorage.tokenExp = data.tokenexp;
      state.token = data.refleshToken;
      state.tokenExp = data.tokenExp;
    },
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExp');
      localStorage.removeItem('user');
      localStorage.removeItem('company');
      localStorage.removeItem('platform');
      localStorage.removeItem('platformPower');
      localStorage.removeItem('companyPower');
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
      let {
        company,
        platform
      } = payload.user;

      if (company.length > 0 || platform.length > 0) {
        $message.success("登录成功");
        context.commit('setUser', payload);
        if (company.length > 1 || platform.length > 1) {
          router.replace('/chooseCompany');
        }
        if (company.length == 1 && platform.length == 1) {
          router.replace('/chooseCompany');
        }
        if (company.length == 1 && platform.length == 0) {
          context.commit('setCompany', company[0]);
        }
        if (company.length == 0 && platform.length == 1) {
          context.commit('setPlatform', platform[0]);
        }
        router.replace('/order');
      } else {
        $message.show({
          text: `暂为开放个人用户登录此后台系统`,
          icon: 'error',
          color: '#ff5252',
          time: 10000
        });
      }
      // if (payload.user.isSys) {
      //   payload.company = payload.user.company[0];
      //   payload.platform = payload.user.platform[0];
      //   context.commit('setUser', payload);
      //   $message.success("登录成功");
      //   router.replace('/order');
      // } else {
      //   if (payload.user.company.length <= 0) {
      //     $message.show({
      //       text: `暂为开放个人用户登录此后台系统`,
      //       icon: 'error',
      //       color: '#ff5252',
      //       time: 10000
      //     });
      //   }
      // }
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
