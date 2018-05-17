<template>
  <div>
    <message></message>
    <my-header style="border-bottom:1px solid #f3f4f5;box-sizing:border-box;"></my-header>
    <div class="hide-scroll">
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
    height: calc(100vh - 50px);
    overflow-y: auto
  }
  .g-container::-webkit-scrollbar{
    display:none;
  }
  .base-bg {
    background: #f3f4f5
  }
</style>