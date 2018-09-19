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
  computed: {
    orderBadge() {
      return this.$store.state.orderBadge;
    }
  },
  watch: {
    orderBadge: {
      handler: function(val) {
        for (const key in val) {
          this.nav.forEach((item, index) => {
            if (item.state === key) {
              item.badge = val[key];
            }
            this.$set(this.nav, index, item);
          });
        }
      },
      deep: true
    }
  },
  data() {
    return {
      nav: []
    };
  },
  mounted() {
    this.nav = [
      {
        name: "待调度订单",
        color: "red",
        icon: "icon-tiaoduzhongxin",
        path: "/dispatch/order",
        state:'dispatch',
        badge: this.orderBadge.dispatch
      },
      {
        name: "待配送运单",
        color: "red",
        icon: "icon-cf-c97",
        path: "/dispatch/distribution",
        state:'distribution',
        badge: this.orderBadge.distribution
      }
    ];
  }
};
</script>