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
  import CenterNav from "../../common/CenterNav";
  import navObj from '../nav.js';
  export default {
    components: {
      CenterNav
    },
    data() {
      return {
        nav: [{
          name: '添加公司',
          icon: 'icon-jia',
          path: '/sys/company/add'
        }, {
          name: '公司列表',
          icon: 'icon-liebiao',
          path: '/sys/company/list'
        }]
      }
    },
    watch: {
      orderBadge: {
        handler: function(val) {
          this.setNav(val);
        },
        deep: true
      }
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
  }
</script>

<style scoped>

</style>