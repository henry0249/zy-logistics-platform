function setTitle(el, binding, vnode) {
  if (binding.value !== undefined) {
    console.log(vnode.context.$options.title);
    document.title = binding.value;
  }
}
export default {
  install(Vue) {
    Vue.directive('title', {
      inserted: setTitle,
      updated: setTitle
    })
  }
}
