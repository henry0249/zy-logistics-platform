<template>
  <div>
    <center-nav :data.sync="nav" @change="change"></center-nav>
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
import CenterNav from "../views/common/CenterNav";
export default {
  props: {
    router: {
      type: Array,
      default() {
        return [];
      }
    },
    badgeType: {
      type: String,
      default: ""
    }
  },
  components: {
    CenterNav
  },
  data() {
    return {
      nav: []
    };
  },
  methods: {
    async setNav() {
      this.nav = [];
      this.router[0].children.forEach(item => {
        if (item.meta && item.meta.nav) {
          this.nav.push(item);
        }
      });
      if (!this.badgeType) return;
      try {
        let val = await this.$ajax.post("/badge/sub/header", {
          type: this.badgeType
        });
        for (const key in val) {
          this.nav.map((item, index) => {
            if (item.meta && item.meta.state === key) {
              item.badge = val[key];
            }
            this.$set(this.nav, index, item);
          });
        }
      } catch (error) {}
    },
    change(path) {
      if (!path) return;
      if (path === `/${this.badgeType}`) this.setNav(this.badgeType);
    }
  },
  mounted() {
    this.setNav(this.badgeType);
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