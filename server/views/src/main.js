// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import './filters' //全局过滤器
import './directives' //全局指令
import './mixin' //全局混入
import './components' //全局组件
import './assets/app.css' //通用css
import './assets/app.js' //通用js
import './lib' //第三方插件库
import './api' //全局接口

Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
