<template>
  <div class="flex ac g-header body-padding">
    <img class="logo" :src="logoImg" alt="">
    <div class="flex ac my-nav" style="margin-left:20px">
      <div v-if="!item.hide" @click="navClick(item,index)" v-ripple class="ac nav-item" :class="{active:index === activeNavIndex}" v-for="(item,index) in nav" :key="index">
        <icon style="margin-right:5px" small v-if="item.icon">{{item.icon}}</icon>
        <div class="flex ac">
          {{item.name}}
          <el-badge v-if="item.badge!==undefined && item.badge>0" :value="item.badge">
          </el-badge>
        </div>
      </div>
    </div>
    <div class="f1"></div>
    <div v-if="roleCompany.length>0 && $route.path.indexOf('sys')<0">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="pointer" style="color:rgb(255, 208, 75)">
          <i class="el-icon-location el-icon--left"></i>
          {{company.name || company.nick}}
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in roleCompany" :key="index" :command="index">
            {{item.name || item.nick}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="width:20px"></div>
    <!-- <el-badge value="6" class="item" style="margin:0 25px">
      <i class="el-icon-bell" style="font-size:18px;color:rgb(255, 208, 75)"></i>
    </el-badge> -->
    <el-dropdown>
      <div class="flex ac pointer" style="color:#fff">
        <icon size="20" style="margin-right:5px;margin-bottom:2px">face</icon>
        <div>{{user.name || user.mobile|hideMobile}}</div>
      </div>
      <el-dropdown-menu slot="dropdown" style="width:100px">
        <el-dropdown-item  @click.native="$router.push('/order')">主页</el-dropdown-item>
        <el-dropdown-item disabled>个人中心</el-dropdown-item>
        <el-dropdown-item v-if="isSys" @click.native="$router.push('/sys/system')">系统后台</el-dropdown-item>
        <el-dropdown-item @click.native="$store.dispatch('logout')">注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav: [],
      logoImg:
        "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-16-zyfz_logo.png"
    };
  },
  computed: {
    activeNavIndex() {
      let res = -1;
      this.$route.matched.forEach(matchedItem => {
        this.nav.forEach((navItem, navIndex) => {
          if (navItem.path === matchedItem.path) {
            this.defaultActive = navItem.path;
            res = navIndex;
          }
        });
      });
      return res;
    }
  },
  watch: {
    company: {
      handler(val, old) {
        if (old && old._id) {
          this.$message.success(`${val.name}`);
        }
      },
      deep: true
    },
    $route() {
      this.setNav();
      this.$store.dispatch("getOrderBadge");
    },
    orderBadge: {
      handler: function(val) {
        this.setHeaderBadge();
      },
      deep: true
    }
  },
  methods: {
    navClick(item, index) {
      if (!item.path) {
        this.$message.info(item.name + "即将开放");
      }
      this.$router.push(item.path);
    },
    handleCommand(index) {
      this.$store.commit("setCompany", this.roleCompany[index]);
      this.$store.dispatch("getRole", this.roleCompany[index]._id);
    },
    setNav() {
      this.nav = [];
      if (this.$route.path.indexOf("sys") > -1) {
        this.nav = [
          {
            name: "商品管理",
            path: "/sys/goods",
            icon: "icon-leixing"
          },
          {
            name: "公司管理",
            path: "/sys/company",
            icon: "icon-GSB"
          },
          {
            name: "用户管理",
            path: "/sys/user",
            icon: "icon-yonghu-qunzu"
          },
          {
            name: "区域管理",
            path: "/sys/area",
            icon: "icon-quyu"
          },
          {
            name: "系统管理",
            path: "/sys/system",
            icon: "icon-icon-test"
          }
        ];
      } else {
        this.nav = [
          {
            name: "贸易订单管理",
            path: "/order",
            icon: "icon-daichulidingdan"
          },
          {
            name: "调度中心",
            path: "/dispatch",
            icon: "icon-tiaoduzhongxin"
          },
          {
            name: "物流单管理",
            path: "/logistics",
            icon: "icon-wuliu"
          },
          {
            name: "财务结算",
            path: "/settle",
            icon: "icon-jiesuan"
          },
          {
            name: "库存管理",
            path: "/stock",
            icon: "icon-leixing"
          },
          {
            name: "商品管理",
            path: "/goods",
            icon: "icon-tianjiashangpin1"
          },
          {
            name: "统计报表",
            path: "",
            icon: "icon-chart"
          },
          {
            name: "公司管理",
            path: "/company",
            icon: "icon-GSB"
          }
        ];
      }
    },
    setHeaderBadge() {
      this.nav.forEach((item, index) => {
        if (item.path === "/order") {
          item.badge =
            this.orderBadge.salesman +
            this.orderBadge.salesmanManager +
            this.orderBadge.tradeClerk;
          this.$set(this.nav, index, item);
        }
        if (item.path === "/dispatch") {
          item.badge =
            this.orderBadge.dispatcher +
            this.orderBadge.dispatcherManager +
            this.orderBadge.logisticsClerk +
            this.orderBadge.logistics.dispatcher +
            this.orderBadge.logistics.dispatcherManager +
            this.orderBadge.logistics.logisticsClerk;
          this.$set(this.nav, index, item);
        }
        if (item.path === "/settle") {
          item.badge =
            this.orderBadge.documentClerk +
              this.orderBadge.documentClerkManager || 0;
          this.$set(this.nav, index, item);
        }
      });
    }
  },
  async created() {
    this.$store.commit("globalLoadingToggle", true);
    try {
      await this.$store.dispatch("getLoginInfo");
    } catch (error) {
      this.$route.replace("/login");
      this.$store.commit("globalLoadingToggle", false);
    }
    this.$store.commit("globalLoadingToggle", false);
    this.setNav();
    this.setHeaderBadge();
  }
};
</script>

<style scoped>
.g-header {
  background: #545c64;
  height: 50px;
  color: #fff;
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
  color: #fff;
}
.nav-item.active {
  color: rgb(255, 208, 75);
  /* border-bottom: 1px solid rgb(255, 208, 75); */
  background: rgba(255, 208, 75, 0.1);
}
</style>