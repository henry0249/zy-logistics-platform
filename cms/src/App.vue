<template>
  <div>
    <message></message>
    <my-header v-if="showGlobalHeader" style="border-bottom:1px solid #f3f4f5;box-sizing:border-box;"></my-header>
    <div class="hide-scroll" v-loading="globalLoading" element-loading-text="加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
      <div class="g-container" v-if="globalLoading">
      </div>
      <div v-if="!globalLoading">
        <keep-alive>
          <transition name="fade">
            <router-view v-if="$route.meta.keepAlive">
              <!-- 这里是会被缓存的视图组件-->
            </router-view>
          </transition>
        </keep-alive>
        <transition name="fade">
          <router-view v-if="!$route.meta.keepAlive">
            <!-- 这里是不被缓存的视图组件-->
          </router-view>
        </transition>
      </div>
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
    let path = this.$route.path;
    this.$store.commit("globalLoadingToggle", true);
    if (
      path.indexOf("login") > -1 ||
      path.indexOf("notfound") > -1 ||
      path.indexOf("index") > -1
    ) {
      this.$store.commit("globalLoadingToggle", false);
    } else {
      this.$store.commit("headerToggle", true);
    }
  }
};
</script>

<style>
html,
body {
  min-width: 1024px;
}
.body-height {
  height: calc(100vh - 50px - 35px - 35px);
  overflow-y: auto;
}
.body-padding{
  padding: 0% 1%;
}
.g-container {
  height: calc(100vh - 50px);
  overflow-y: auto;
}
.g-container::-webkit-scrollbar {
  display: none;
}
.g-order-container {
  padding: 0% 5%;
  min-height: calc(100vh - 50px);
}
.g-order-container-border {
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 4px;
}
.g-order-body {
  padding: 2%;
  border: 1px solid #eee;
  border-radius: 4px;
}
.base-bg {
  background: #f3f4f5;
}
.my-div {
  padding: 15px;
  background: #aaa;
  color: #fff;
}
.my-title {
  font-size: 20px;
  text-align: center;
}
.el-tabs__header {
  margin-bottom: 0px;
}
.ivu-input-small {
  height: 28px;
}
.el-menu .is-active {
  background: #aaa;
}
</style>