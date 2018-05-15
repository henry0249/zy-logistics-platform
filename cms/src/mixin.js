import Vue from 'vue'

//全局混入 设置网站标题
Vue.mixin({
  computed: {
    user() {
      return this.$store.state.user;
    },
    company() {
      return this.$store.state.company;
    },
    isSys() {
      return this.$store.state.isSys;
    },
    $state() {
      return this.$store.state;
    }
  }
})
