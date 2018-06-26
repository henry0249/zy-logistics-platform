<template>
  <div class="flex ac g-header" v-if="showHeader">
    <img class="logo" :src="logoImg" alt="">
    <div class="flex ac my-nav" style="margin-left:20px">
      <div v-if="!item.hide" @click="navClick(item,index)" v-ripple class="ac nav-item" :class="{active:index === activeNavIndex}" v-for="(item,index) in nav" :key="index">
        <icon style="margin-right:5px" small v-if="item.icon">{{item.icon}}</icon>
        <div>
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="f1"></div>
    <!-- <el-badge value="6" class="item" style="margin:0 20px">
          <i class="el-icon-bell" style="font-size:18px;color:#FFB300"></i>
        </el-badge> -->
    <el-dropdown>
      <div class="flex ac">
        <icon size="20" style="margin-right:5px" color="#2196F3">face</icon>
        <div>{{user.name || user.mobile|hideMobile}}</div>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown" style="width:100px">
        <el-dropdown-item disabled>个人中心</el-dropdown-item>
        <el-dropdown-item @click.native="$store.dispatch('logout')">注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logoImg:
        "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-16-zyfz_logo.png",
      nav: []
    };
  },
  computed: {
    showHeader() {
      let flag = true;
      if (
        this.$route.path.indexOf("login") > -1 ||
        this.$route.path.indexOf("chooseCompany") > -1 ||
        this.$route.path.indexOf("notfound") > -1
      ) {
        flag = false;
      }
      return flag;
    },
    activeNavIndex() {
      let res = -1;
      this.nav.forEach((item, index) => {
        if (this.$route.matched.length > 0) {
          if (item.path.indexOf(this.$route.matched[0].path) > -1) {
            res = index;
          }
        } else {
          if (item.path === this.$route.path) {
            res = index;
          }
        }
      });
      return res;
    }
  },
  methods: {
    navClick(item, index) {
      if (!item.path) {
        this.$message.info(item.name + "即将开放");
      }
      this.$router.push(item.path);
    },
    badgeNotify(val, old, type) {
      let tipObj = {
        taking: "待接单消息",
        check: "订单待审核",
        distribution: "订单待配货",
        dispatch: "订单待调度",
        settlement: "订单待结算"
      };
      let tip = tipObj[type];
      let newCount = val - old || 0;
      if (tip && newCount > 0) {
        let _this = this;
        this.$notify.success({
          title: tip,
          dangerouslyUseHTMLString: true,
          duration: 3000,
          message: `您有<strong><i>${newCount}</i></strong>个新订单`,
          onClick: function() {
            console.log(_this);
            console.log(_this.$router);
            _this.$router.push("/order/" + type);
          }
        });
      }
    }
  },
  watch: {
    async $route() {
      if (localStorage.token) {
        let res = await this.$store.dispatch("orderBadgeNotify");
        let { newBadge, oldBadge } = res;
        for (const key in newBadge) {
          this.badgeNotify(newBadge[key], oldBadge[key], key);
        }
      }
    }
  },
  mounted() {
    this.nav = [
      {
        name: "订单管理",
        path: "/order",
        icon: "icon-daichulidingdan"
      },
      {
        name: "运单管理",
        path: "",
        icon: "icon-wuliu"
      },
      {
        name: "商品管理",
        path: "/goods",
        icon: "icon-leixing"
      },
      {
        name: "财务管理",
        path: "",
        icon: "icon-jiesuan"
      },
      {
        name: "统计报表",
        path: "",
        icon: "icon-chart"
      },
      {
        name: "公司管理",
        path: "",
        icon: "icon-GSB"
      },
      {
        name: "平台管理",
        path: "/platform",
        icon: "icon-pingtai1"
      },
      {
        name: "系统管理",
        path: "/sys",
        icon: "icon-xitongguanli",
        hide: this.user.isSys !== true
      }
    ];
    // let sti;
    // if (localStorage.token) {
    //   try {
    //     sti = setInterval(async () => {
    //       if (localStorage.token) {
    //         let res = await this.$store.dispatch("orderBadgeNotify");
    //         let { newBadge, oldBadge } = res;
    //         for (const key in newBadge) {
    //           this.badgeNotify(newBadge[key], oldBadge[key], key);
    //         }
    //       } else {
    //         window.clearInterval(sti);
    //       }
    //     }, 20000);
    //   } catch (error) {}
    // } else {
    //   window.clearInterval(sti);
    // }
  }
};
</script>

<style scoped>
.g-header {
  background: #fff;
  height: 50px;
  padding: 0 2rem;
}
.logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.nav-item {
  padding: 0 15px;
  line-height: 50px;
  cursor: pointer;
  color: #757575;
}
.nav-item.active {
  color: #42a5f5;
  border-bottom: 1px solid #42a5f5;
}
</style>