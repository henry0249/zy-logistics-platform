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
    async $route(val) {
      if (localStorage.token) {
        await this.$store.dispatch("orderBadgeNotify");
      }
    },
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
        name: "订单预审",
        color: "red",
        icon: "icon-jiesuan",
        path: "/order/financialPretrial",
        state: "financialPretrial",
        badge: this.orderBadge.financialPretrial
      },
      {
        name: "账户结算",
        color: "red",
        icon: "icon-jiesuan",
        path: "/order/accountSettlement",
        state: "accountSettlement",
        badge: this.orderBadge.accountSettlement
      },
      {
        name: "账款确认",
        color: "red",
        icon: "icon-jiesuan",
        path: "/order/accountConfirmation",
        state: "accountConfirmation",
        badge: this.orderBadge.accountConfirmation
      }
    ];
    if (localStorage.token) {
      this.$store.dispatch("orderBadgeNotify");
    }
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