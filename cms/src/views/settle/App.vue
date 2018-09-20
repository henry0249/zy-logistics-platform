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
import { settle } from "../common/orderLeftNav.js";
export default {
  components: {
    LeftNav
  },
  watch: {
    orderBadge: {
      handler: function(val) {
        this.setNav(val);
      },
      deep: true
    }
  },
  data() {
    return {
      nav: [...settle]
    };
  },
  methods: {
    setNav(val) {
      for (const key in val) {
        this.nav.forEach((item, index) => {
          if (item.state === key) {
            item.badge = val[key];
          }
          this.$set(this.nav, index, item);
        });
      }
    }
  },
  mounted() {
    this.setNav(this.orderBadge);
  }
};
</script>

<style>
</style>