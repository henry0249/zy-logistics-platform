import Vue from 'vue'
import axios from 'axios'
import store from '../store';
import router from '../router';
import {
  MessageBox
} from 'element-ui';

function getCookie(name) {
  var strcookie = document.cookie; //获取cookie字符串
  var arrcookie = strcookie.split("; "); //分割
  //遍历匹配
  for (var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split("=");
    if (arr[0] == name) {
      return arr[1];
    }
  }
  return "";
}
// 创建一个axios实例
const baseURL = process.env.NODE_ENV === 'development' ? '/api' : '';
const ajax = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 25000 // 请求超时时间
})
// 注册请求拦截器
ajax.interceptors.request.use(async config => {
  if (window.sessionStorage && window.localStorage) {
    if (localStorage.token || sessionStorage.token) {
      config.headers['Authorization'] = localStorage.token || sessionStorage.token;
    }
  }
  // config.headers['csrfToken'] = getCookie('csrfToken');
  return config;
}, err => {
  return Promise.reject(err)
})
// 注册响应拦截器
ajax.interceptors.response.use(response => {
  if (response.headers.refleshtoken) {
    store.commit('setToken', {
      token: response.headers.refleshtoken,
      exp: response.headers.tokenexp
    })
  }
  return Promise.resolve(response.data)
}, err => {
  MessageBox.confirm(`${err.response.status}:${err.response.data.message || err.message }`, '提示', {
    showCancelButton: false,
    confirmButtonText: err.response.status === 401 ? '重新登录' : '确定',
    type: 'error',
    center: true
  }).then(() => {
    if (err.response.status === 401) {
      router.replace('/')
    }
  }).catch(() => {

  });
  return Promise.reject(err)
})

export default {
  install(Vue) {
    Vue.prototype.$ajax = ajax
  },
  ajax
}
