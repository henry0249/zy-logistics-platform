import axios from 'axios';
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
  if (window.localStorage) {
    if (localStorage.token) {
      config.headers['Authorization'] = localStorage.token;
    }
  }
  // config.headers['csrfToken'] = getCookie('csrfToken');
  return config;
}, err => {
  return Promise.reject(err)
})
let errCount = 0; //错误计数器,防止错误提示多次弹出
// 注册响应拦截器
ajax.interceptors.response.use(response => {
  errCount = 0;
  if (response.headers.refleshtoken) {
    store.commit('setToken', response.headers.refleshtoken);
    localStorage.token = response.headers.refleshtoken;
  }
  return Promise.resolve(response.data);
}, err => {
  errCount++;
  if (errCount === 1) {
    MessageBox.confirm(`${err.response.status}:${err.response.data.message || err.message }`, '提示', {
      showCancelButton: false,
      confirmButtonText: err.response.status === 401 ? '重新登录' : '确定',
      type: 'error',
      center: true
    }).then((data) => {
      errCount = 0;
    }).catch((err) => {
      errCount = 0;
    });
  }
  if (err.response.status === 401) {
    store.commit('setToken', '');
    router.replace('/');
  }
  return Promise.reject(err);
});

export default {
  install(Vue) {
    Vue.prototype.$ajax = ajax
  },
  ajax
}