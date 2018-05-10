<template>
  <div class="g-goods flex">
    <div>
      <left-nav :nav="nav"></left-nav>
    </div>
    <div class="f1">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件-->
        </router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive">
        <!-- 这里是不被缓存的视图组件-->
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
  watch: {
    $route(val) {
      let io = true;
      this.nav.forEach((item, index) => {
        if (val.path == item.path) {
          this.activeIndex = index;
          io = false;
        }
      });
      if (io) {
        this.activeIndex = null;
      }
    }
  },
  created() {
    this.nav = [
      {
        name: "平台管理",
        icon: "icon-pingtai1",
        hide: !this.isSys,
        // path: '/organizationa/platform',
        color: "#EF5350"
      },
      {
        name: "公司管理",
        // path: '/organizationa/company',
        icon: "icon-company1",
        color: "#455A64"
      },
      {
        name: "用户管理",
        icon: "icon-yonghu-qunzu",
        // path: '/organizationa/user',
        color: "#42A5F5"
      }
    ];
  }
};
</script>

<style scoped>

</style>