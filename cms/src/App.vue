<template>
  <div>
    <message></message>
    <my-header style="border-bottom:1px solid #f3f4f5;box-sizing:border-box;"></my-header>
    <loading-box class="hide-scroll" v-model="loadingText">
      <div class="g-container" v-if="loadingText">
      </div>
      <div v-if="!loadingText">
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
    </loading-box>
  </div>
</template>

<script>
import MyHeader from "./views/common/Header.vue";
export default {
  components: {
    MyHeader
  },
  data() {
    return {
      loadingText: "加载中"
    };
  },
  computed: {
    showHeader() {
      let flag = true;
      if (
        this.$route.path.indexOf("login") > -1 ||
        this.$route.path.indexOf("chooseCompany") > -1 ||
        this.$route.path.indexOf("notfound") > -1
      ) {
        flag = false;
      }
      return flag;
    }
  },
  async created() {
    if (localStorage.token) {
      this.$store.commit("getLocalToken");
      if (this.showHeader) {
        try {
          await this.$store.dispatch("getLoginInfo");
        } catch (error) {}
      }
    }
    this.loadingText = "";
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
  overflow-y: auto;
}
.g-container::-webkit-scrollbar {
  display: none;
}
.base-bg {
  background: #f3f4f5;
}
</style>