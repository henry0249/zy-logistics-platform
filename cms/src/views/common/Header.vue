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
    <el-badge value="6" class="item" style="margin:0 20px">
      <i class="el-icon-bell" style="font-size:18px;color:#FFB300"></i>
    </el-badge>
    <div v-if="loginInfo.company" class="tf1 pointer" style="padding:0 20px;color:#2196F3">
      <i class="el-icon-menu"></i> {{loginInfo.company.name}}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </div>
    <el-dropdown>
      <div class="flex ac pointer">
        <icon size="20" style="margin-right:5px;margin-bottom:2px" color="#2196F3">face</icon>
        <div>{{user.name || user.mobile|hideMobile}}</div>
      </div>
      <el-dropdown-menu slot="dropdown" style="width:100px">
        <el-dropdown-item disabled>个人中心</el-dropdown-item>
        <el-dropdown-item @click.native="$store.dispatch('logout')">注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
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
          if (item.path && item.path.indexOf(this.$route.matched[0].path) > -1) {
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
    }
  },
  watch: {
    async $route() {
      if (localStorage.token) {
        let res = await this.$store.dispatch("orderBadgeNotify");
      } else {
        MessageBox.confirm(`您的登录状态已失效`, "提示", {
          showCancelButton: false,
          confirmButtonText: "重新登录",
          type: "error",
          center: true
        }).then(() => {
          this.$router.replace("/");
        });
      }
    }
  },
  mounted() {
    if (this.$route.path.indexOf("sys") > -1) {
      this.nav = [
        {
          name: "商品管理"
        },
        {
          name: "公司管理",
        },
        {
          name: "用户管理",
        },
        {
          name: "区域管理",
        },
        {
          name: "系统管理",
        }
      ];
    } else {
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
          name: "库存管理",
          path: "",
          icon: "icon-leixing"
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
        }
      ];
    }
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