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
          name: "订单计划",
          color: "red",
          icon: "icon-chuangjiandingdan",
          path: "/order/create"
        },
        {
          name: "待接单",
          color: "red",
          icon: "icon-jiedanyingli",
          path: "/order/taking",
          badge: 8
        },
        {
          name: "待审核",
          color: "red",
          icon: "icon-shenhe1",
          path: "/order/check",
          badge: 0
        },
        {
          name: "待配货",
          color: "red",
          icon: "icon-cf-c97",
          path: "/order/distribution",
          badge: 0
        },
        {
          name: "待调度",
          color: "red",
          icon: "icon-tiaoduzhongxin",
          path: "/order/dispatch",
          badge: 0
        },
        {
          name: "待结算",
          color: "red",
          icon: "icon-jiesuan",
          path: "/order/settlement",
          badge: 0
        },
        {
          name: "所有订单",
          color: "red",
          icon: "icon-liebiao",
          path: "/order/all",
          badge: 0
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