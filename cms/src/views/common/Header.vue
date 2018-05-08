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
        logoImg: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-04-24-%E9%94%A6%E6%B4%B2%E5%BB%BA%E8%AE%BElogo_meitu_1.jpg",
        // activeNavIndex: 0,
        nav: [{
            name: "需求市场",
            path: "/home/index",
            icon: "shopping_cart"
          },
          {
            name: "配货中心",
            path: "",
            icon: "dashboard"
          },
          {
            name: "订单管理",
            path: "",
            icon: "assignment"
          },
          {
            name: "物流调度",
            path: "",
            icon: "local_shipping"
          },
          {
            name: "财务中心",
            path: "",
            icon: "attach_money"
          },
          {
            name: "商品管理",
            path: "/goods/list",
            icon: "store"
          },
          {
            name: "组织架构",
            path: "/organizationa/platform",
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
        let res = -1
        this.nav.forEach((item, index) => {
          if (item.path === this.$route.path) {
            res = index
          }
        })
        return res
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
    padding: 0 5%;
    height: 40px;
  }
  .logo {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .nav-item {
    padding: 0 15px;
    line-height: 40px;
    cursor: pointer;
    color: #757575;
  }
  .nav-item.active {
    color: #42a5f5;
    border-bottom: 1px solid #42a5f5;
  }
</style>