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
            if (item.path.indexOf(key) > -1) {
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
        badge: this.orderBadge.taking
      },
      {
        name: "调度前审核",
        color: "red",
        icon: "icon-shenhe1",
        path: "/order/dispatchCheck",
        badge: this.orderBadge.dispatchCheck
      },
      {
        name: "待调度",
        color: "red",
        icon: "icon-tiaoduzhongxin",
        path: "/order/dispatch",
        badge: this.orderBadge.dispatch
      },
      {
        name: "待配送",
        color: "red",
        icon: "icon-cf-c97",
        path: "/order/distribution",
        badge: this.orderBadge.distribution
      },
      {
        name: "待审核",
        color: "red",
        icon: "icon-shenhe1",
        path: "/order/check",
        badge: this.orderBadge.check
      },
      {
        name: "结算前审核",
        color: "red",
        icon: "icon-shenhe1",
        path: "/order/finishCheck",
        badge: this.orderBadge.finishCheck
      },
      {
        name: "待结算",
        color: "red",
        icon: "icon-jiesuan",
        path: "/order/finish",
        badge: this.orderBadge.finish
      },
      {
        name: "所有订单",
        color: "red",
        icon: "icon-liebiao",
        path: "/order/all"
      }
    ];
  }
};
</script>

<style>
.g-order-container {
  padding: 3% 5%;
  min-height: calc(100vh - 50px);
}
.g-order-body {
  padding: 3%;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>