<template>
  <div class="flex">
    <left-nav :nav="nav" @itemClick="navClick"></left-nav>
    <div class="f1 g-container" style="overflow:hidden">
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
      nav: [
        {
          name: "创建订单",
          color: "red",
          icon: "icon-ed4",
          path: "/order/create"
        },
        {
          name: "待接单",
          color: "red",
          icon: "icon-ed4",
          path: "/order/taking"
        },
        {
          name: "待审核",
          color: "red",
          icon: "icon-ed4",
          path: "/order/check"
        },
        {
          name: "待配货",
          color: "red",
          icon: "icon-ed4",
          path: "/order/distribution"
        },
        {
          name: "待调度",
          color: "red",
          icon: "icon-ed4",
          path: "/order/dispatch"
        },
        {
          name: "待结算",
          color: "red",
          icon: "icon-ed4",
          path: "/order/settlement"
        }
      ]
    };
  },
  methods: {
    navClick() {}
  }
};
</script>

<style scoped>

</style>