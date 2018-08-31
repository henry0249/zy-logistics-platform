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
        name: "添加库存",
        icon: "icon-structure",
        path: "/stock/add",
        color: "#EF5350"
      },
      {
        name: "库存列表",
        icon: "icon-structure",
        path: "/stock/list",
        color: "#EF5350"
      }
    ];
  }
};
</script>

<style scoped>

</style>