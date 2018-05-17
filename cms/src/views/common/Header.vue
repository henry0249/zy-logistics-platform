<template>
  <div class="flex ac g-header" v-if="showHeader">
    <img class="logo" :src="logoImg" alt="">
    <div class="flex ac my-nav" style="margin-left:20px">
      <div @click="navClick(item,index)" v-ripple class="ac nav-item" :class="{active:index === activeNavIndex}" v-for="(item,index) in nav" :key="index">
        <!-- <v-icon small v-if="item.icon">{{item.icon}}</v-icon> -->
        <div>
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="f1"></div>
    <el-badge value="6" class="item" style="margin:0 20px">
      <i class="el-icon-bell" style="font-size:18px;color:#FFB300"></i>
    </el-badge>
    <el-dropdown>
      <div class="flex ac">
        <icon size="20" style="margin-right:5px" color="#2196F3">face</icon>
        <div>{{user.name || user.mobile|hideMobile}}</div>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown" style="width:100px">
        <el-dropdown-item disabled>个人中心</el-dropdown-item>
        <el-dropdown-item>注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- <v-btn flat icon color="red lighten-1">
              <v-icon>volume_up</v-icon>
            </v-btn>
            <v-btn flat icon color="blue lighten-2">
              <v-icon>notifications</v-icon>
            </v-btn>
            <v-btn flat icon color="green lighten-2">
              <v-icon>face</v-icon>
            </v-btn> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        logoImg: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-16-zyfz_logo.png",
        nav: [{
            name: "待处理订单",
            path: "/home/index",
            icon: "shopping_cart"
          },
          {
            name: "物流详情",
            path:'',
            icon: "store"
          },
          {
            name: "商品管理",
            path: "/goods",
            icon: "store"
          },
          {
            name: "组织架构",
            path: "/org",
            icon: "supervisor_account"
          }
        ]
      };
    },
    computed: {
      showHeader() {
        let flag = true;
        if (
          this.$route.path.indexOf("login") > -1 ||
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