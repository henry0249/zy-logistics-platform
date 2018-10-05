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
import { settle } from "../common/orderLeftNav.js";
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
.order-border{
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>