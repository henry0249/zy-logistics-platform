import Vue from 'vue'

//全局混入 设置网站标题
Vue.mixin({
  computed: {
    loginInfo() {
      return this.$store.state.loginInfo || {};
    },
    user() {
      return this.$store.state.loginInfo.user || {};
    },
    company() {
      return this.$store.state.loginInfo.company || {};
    },
    platform() {
      return this.$store.state.loginInfo.platform || {};
    },
    isSys() {
      return this.$store.state.loginInfo.user.isSys || false;
    },
    field() {
      return this.$store.state.field || {};
    },
    $state() {
      return this.$store.state;
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    area2arr(data) {
      let res = [];
      let areaSelectType = ["province", "city", "county", "township"];
      areaSelectType.forEach(item => {
        if (data[item]) {
          res.push(data[item]._id || data[item]);
        }
      });
      res.push(data._id);
      return res;
    },
    area2name(data) {
      let res = [];
      let areaSelectType = ["province", "city", "county", "township"];
      areaSelectType.forEach(item => {
        if (data[item] && data[item].name) {
          res.push(data[item].name);
        }
      });
      res.push(data.name);
      return res.join('-');
    }
  }
})
