import VueSticky from 'vue-sticky'
export default {
  install(Vue) {
    Vue.directive('sticky', VueSticky)
  }
}
