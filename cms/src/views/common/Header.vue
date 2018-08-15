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
    <div v-if="roleCompany.length>0 && $route.path.indexOf('sys')<0">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="blue pointer">
          {{company.name || company.nick}}<i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in roleCompany" :key="index" :command="index">
            {{item.name || item.nick}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-badge value="6" class="item" style="margin:0 20px">
      <i class="el-icon-bell" style="font-size:18px;color:#FFB300"></i>
    </el-badge>
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
        let path = item.path;
        if (this.$route.matched.length > 0) {
          let matchedPath = this.$route.matched[0].path;
          if (this.$route.path.indexOf("sys") > -1) {
            matchedPath = this.$route.matched[1].path;
          }
          if (item.path && item.path.indexOf(matchedPath) > -1) {
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
    handleCommand(index) {
      this.$store.commit("setCompany", this.roleCompany[index]);
      this.$message.success(
        `【${this.roleCompany[index].name}】切换为当前公司`
      );
    }
  },
  watch: {
    async $route(val) {
      if (localStorage.token && val.redirectedFrom !== "/") {
        // let res = await this.$store.dispatch("orderBadgeNotify");
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