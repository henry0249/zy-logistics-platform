import axios from 'axios'
import {
  Message
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
  // let csrfTokenRes = await axios.get(baseURL + '/session')
  // config.headers['x-csrf-token'] = csrfTokenRes.data.csrfToken;
  if (window.sessionStorage && window.localStorage) {
    if (sessionStorage.token || localStorage.token) {
      config.headers['token'] = sessionStorage.token || localStorage.token
    }
  }
  return config
}, err => {
  return Promise.reject(err)
})
// 注册响应拦截器
ajax.interceptors.response.use(response => {
  if (response.request.responseURL != (location.origin + location.pathname)) {
    window.location.href = response.request.responseURL
  }
  return Promise.resolve(response.data)
}, err => {
  // $message.show({
  //   text: `${err.response.status}:${err.response.data.message || err.message }`,
  //   icon: 'error',
  //   color: '#ff5252',
  //   time: 10000
  // })
  Message({
    showClose: true,
    message: `${err.response.status}:${err.response.data.message || err.message }`,
    type: 'error',
    duration: '10000'
  });
  return Promise.reject(err)
})

export default {
  install(Vue) {
    Vue.prototype.$ajax = ajax
  },
  ajax
}
