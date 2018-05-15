<template>
  <div class="flex">
    <left-nav :nav="nav" @itemClick="navClick"></left-nav>
    <div class="f1 g-container app-box" style="overflow:hidden">
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
  import LeftNav from '../common/LeftNav';
  export default {
    components: {
      LeftNav
    },
    data() {
      return {
        nav: [{
          name: '需求列表',
          color: 'red',
          icon: 'icon-ed4',
          path: '/home/index',
        }, {
          name: "添加",
          icon: "icon-add",
          // hide: !this.isSys,
          color: "#094",
          children: [{
              name: "添加商品",
              icon: "icon-add",
              path: "/home/add_goods",
              color: "#094"
            },
            {
              name: "添加订单",
              icon: "icon-add",
              path: "/home/add_order",
              color: "#094"
            }
          ]
        }, ]
      }
    },
    methods: {
      navClick() {}
    }
  }
</script>

<style scoped>
  .app-box {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
</style>