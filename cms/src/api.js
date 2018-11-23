import Vue from 'vue'
import {
  MessageBox
} from 'element-ui';
import ajaxLib from './lib/axios'
const ajax = ajaxLib.ajax;

function error(msg) {
  MessageBox.confirm(msg, '提示', {
    showCancelButton: false,
    confirmButtonText: '确定',
    type: 'error',
    center: true
  });
  throw new Error(msg);
};

let Api = {
  //获取地址栏参数
  getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  },
  async quickReg(data) {
    return ajax.post('/reg/mobile', data)
  },
  async login_local(data) {
    return ajax.post('/login/local', data)
  },
  async login_sys(data) {
    return ajax.post('/login/sys', data)
  },
  async register_phone(data) {
    return ajax.post('/register/mobile', data)
  },
  async psw(data) {
    return ajax.post('/psw', data)
  },
  async sendSms(data) {
    return ajax.post('/sms/send', data)
  },
  async vdSms(data) {
    return ajax.post('/sms/vd', data)
  },
  // async getArea() {
  //   return ajax('/area/cascader')
  // }
  async curd(data) {
    let {
      model,
      curdType
    } = data;
    delete data.model;
    delete data.curdType;
    return ajax.post(`/${model}/${curdType}`, data);
  },
  async sql(url, data) {
    let urlArr = url.split('/');
    let model, curdType;
    if (urlArr.length === 2 || urlArr.length === 3) {
      if (urlArr.length === 2) {
        model = urlArr[0];
        curdType = urlArr[1];
      }
      if (urlArr.length === 3) {
        model = urlArr[1];
        curdType = urlArr[2];
      }
      if (!data) {
        return ajax.post(`/${model}/${curdType}`, data);
      } else {
        return ajax(`/${model}/${curdType}`, data);
      }
    }
  },
  async logout() {
    return ajax.post('/logout')
  }
}

let docs = require.context('./views', true, /api\.js$/);
docs.keys().forEach(item => {
  let name = item.replace('./', '').replace('/api.js', '');
  let docsItem = docs(item).default;
  let data = docsItem(ajax, error);
  Api[name] = data;
});

Vue.prototype.$api = Api;

export default Api
