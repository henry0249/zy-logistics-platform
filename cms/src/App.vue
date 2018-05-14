<template>
  <div>
    <message></message>
    <my-header v-sticky="{stickyTop:0}" style="border-bottom:1px solid #f3f4f5"></my-header>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件-->
      </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件-->
    </router-view>
  </div>
</template>

<script>
import MyHeader from "./views/common/Header.vue";
export default {
  components: {
    MyHeader
  },
  created() {
    this.$store.commit("getLocalUser");
  }
};
</script>

<style>
html,
body {
  min-width: 1024px;
}
.g-container {
  height: calc(100vh - 51px);
  overflow-x: hidden;
  overflow-y: auto;
}
.base-bg{
  background: #f3f4f5
}
</style>