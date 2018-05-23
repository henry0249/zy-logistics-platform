import Vue from 'vue'

//全局混入 设置网站标题
Vue.mixin({
  computed: {
    loginInfo() {
      return this.$store.state.loginInfo;
    },
    user() {
      return this.$store.state.loginInfo.user;
    },
    company() {
      return this.$store.state.loginInfo.company;
    },
    platform() {
      return this.$store.state.loginInfo.platform;
    },
    isSys() {
      return this.$store.state.loginInfo.user.isSys;
    },
    $state() {
      return this.$store.state;
    }
  }
})
