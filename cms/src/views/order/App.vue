<template>
  <div>
    <center-nav :data.sync="nav"></center-nav>
    <div class="body-height">
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
import CenterNav from "../common/CenterNav";
import { order } from "../common/orderLeftNav.js";
import router from "./router.js";
export default {
  components: {
    CenterNav
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
      router: router,
      nav: []
    };
  },
  methods: {
    setNav(val) {
      let currentParentPath = '/order/';
      this.nav = [];
      this.router[0].children.forEach(item => {
        if (item.meta && item.meta.nav) {
          this.nav.push(item);
        }
      });
      for (const key in val) {
        this.nav.forEach((item, index) => {
          if (item.path.replace(currentParentPath,'') === key) {
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
.order-border {
  margin: 0 auto;
  padding: 2%;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>