<template>
  <div class="flex">
    <left-nav :nav.sync="nav"></left-nav>
    <div class="f1 g-container">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
        </router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive">
      </router-view>
    </div>
  </div>
</template>

<script>
import LeftNav from "../common/LeftNav";
export default {
  components: {
    LeftNav
  },
  data() {
    return {
      nav: []
    };
  },
  created() {
    this.nav = [
      {
        name: "平台架构",
        icon: "icon-structure",
        path: "/platform/org",
        color: "#EF5350"
      },
      {
        name: "平台设置",
        icon: "icon-icon-test",
        path: "/platform/setting",
        color: "#EF5350"
      },
      {
        name: "公司管理",
        path: "/platform/company",
        icon: "icon-company1",
        color: "#455A64"
      },
      {
        name: "用户管理",
        icon: "icon-yonghu-qunzu",
        path: "/platform/user",
        color: "#42A5F5"
      }
    ];
  }
};
</script>

<style scoped>

</style>