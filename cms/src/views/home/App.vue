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
          name: '添加订单',
          color: '#094',
          icon: 'icon-add',
          path: '/home/add',
        }]
      }
    },
    methods: {
      navClick() {}
    }
  }
</script>

<style scoped>
  .app-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
</style>