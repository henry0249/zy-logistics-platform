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
      return this.$store.state.company || {};
    },
    roleCompany() {
      return this.$store.state.roleCompany || {};
    },
    isSys() {
      return (this.user && this.user.isSys) || false;
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
      if (!data) {
        return '';
      }
      let res = [];
      let areaSelectType = ["province", "city", "county", "township"];
      areaSelectType.forEach(item => {
        if (data[item]) {
          res.push(data[item]._id || data[item]);
        }
      });
      if (data._id) {
        res.push(data._id);
      }
      return res;
    },
    area2name(data, joinText = '/') {
      if (!(data && data._id)) {
        return '请选择地址';
      }
      let res = [];
      let areaSelectType = ["province", "city", "county", "township"];
      areaSelectType.forEach(item => {
        if (data[item] && data[item].name) {
          res.push(data[item].name);
        }
      });
      if (data.name) {
        res.push(data.name);
      }
      if (res.length === 0) {
        return '';
      }
      return res.join(joinText);
    },
    getElementByAttr(tag, attr, value) {
      var aElements = document.getElementsByTagName(tag);
      var aEle = [];
      for (var i = 0; i < aElements.length; i++) {
        if (aElements[i].getAttribute(attr) == value)
          aEle.push(aElements[i]);
      }
      return aEle;
    }
  }
})
