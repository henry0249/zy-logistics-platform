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
  static async login_local(data) {
    return ajax.post('/passport/local', data)
  }
  static async register_phone(data) {
    return ajax.post('/register/phone', data)
  }
  static async reset_psw(data) {
    return ajax.post('/psw', data)
  }
  static async sendSms(data) {
    return ajax.post('/sms/send', data)
  }
  static async vdSms(data) {
    return ajax.post('/sms/vd', data)
  }
}
Vue.prototype.$api = Api
export default Api