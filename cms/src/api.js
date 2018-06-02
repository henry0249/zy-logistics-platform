import Vue from 'vue'

import ajaxLib from './lib/axios'
const ajax = ajaxLib.ajax

class Api {
  //获取地址栏参数
  static getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }
  static async quickReg(data) {
    return ajax.post('/reg/mobile', data)
  }
  static async login_local(data) {
    return ajax.post('/login/local', data)
  }
  static async register_phone(data) {
    return ajax.post('/register/mobile', data)
  }
  static async psw(data) {
    return ajax.post('/psw', data)
  }
  static async sendSms(data) {
    return ajax.post('/sms/send', data)
  }
  static async vdSms(data) {
    return ajax.post('/sms/vd', data)
  }
  static async getArea() {
    return ajax('/area/select')
  }
  static async curd(data) {
    let {
      model,
      curdType
    } = data;
    delete data.model;
    delete data.curdType;
    return ajax.post(`/${model}/${curdType}`, data);
  }
  static async sql(model, curdType, data) {
    return ajax.post(`/${model}/${curdType}`, data);
  }
  static async logout() {
    return ajax.post('/logout')
  }
}
Vue.prototype.$api = Api
export default Api
