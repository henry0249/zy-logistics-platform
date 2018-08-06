<template>
  <div class="flex">
    <left-nav :nav="nav"></left-nav>
    <div class="f1 g-container">
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
        nav: [{
          name: "区域管理",
          icon: "icon-quyu",
          path: "/sys/area"
        }, {
          name: "区域管理",
          icon: "icon-quyu",
          path: "/sys/area"
        }, {
          name: "区域管理",
          icon: "icon-quyu",
          path: "/sys/area"
        }, {
          name: "区域管理",
          icon: "icon-quyu",
          path: "/sys/area"
        }]
      };
    }
  };
</script>

<style scoped>

</style>