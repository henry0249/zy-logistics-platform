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
            name: '添加商品',
            icon: 'icon-jia',
            path: '/sys/goods/add'
          }, {
            name: '添加品牌',
            icon: 'icon-jia',
            path: '/sys/goods/brand_add'
          }, {
            name: '添加分类',
            icon: 'icon-jia',
            path: '/sys/goods/category_add'
          }, {
            name: '商品列表',
            icon: 'icon-liebiao',
            path: '/sys/goods/list'
          },
          {
            name: "分类列表",
            color: "orange",
            icon: "icon-fenlei",
            path: "/sys/goods/category"
          },
          {
            name: "品牌列表",
            color: "orange",
            icon: "icon-shangbiao",
            iconSize: '15',
            path: "/sys/goods/brand"
          }
        ]
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