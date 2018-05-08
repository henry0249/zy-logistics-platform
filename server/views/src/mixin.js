import Vue from 'vue'

//全局混入 设置网站标题
Vue.mixin({
  created() {
    var title = this.$options.title
    if (title) {
      document.title = title;
    }
  }
})