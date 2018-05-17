<template>
  <div class="flex">
    <left-nav :nav.sync="nav" default-active="/org/platform"></left-nav>
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
        hide: !this.isSys,
        name: "平台架构",
        icon: "icon-structure",
        path: "/org/platform",
        color: "#EF5350"
      },
      {
        hide: !this.isSys,
        name: "平台设置",
        icon: "icon-icon-test",
        path: "/org/platform_setting",
        color: "#EF5350"
      },
      {
        name: "公司管理",
        path: "/org/company",
        icon: "icon-company1",
        color: "#455A64"
      },
      {
        name: "用户管理",
        icon: "icon-yonghu-qunzu",
        path: "/org/user",
        color: "#42A5F5"
      }
    ];
  },
  mounted() {
    if (this.isSys) {
      this.$router.push({
        path: "/org/platform",
        query: this.$route.query
      });
    } else {
      this.$router.push({
        path: "/org/company",
        query: this.$route.query
      });
    }
  }
};
</script>

<style scoped>

</style>