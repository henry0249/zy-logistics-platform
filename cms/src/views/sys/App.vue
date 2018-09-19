<template>
  <div class="flex">
    <!-- <left-nav :nav="nav"></left-nav> -->
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
  import navObj from './nav.js';
  export default {
    components: {
      LeftNav
    },
    data() {
      return {
        navObj
      };
    },
    computed: {
      nav() {
        for (const key in this.navObj) {
          let str = '/sys/' + key
          if (str === this.$route.path) {
            return this.navObj[key];
          }
        }
      }
    }
  };
</script>

<style scoped>

</style>