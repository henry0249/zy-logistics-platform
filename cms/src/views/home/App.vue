<template>
  <div class="g-goods flex">
    <div>
      <left-nav :nav="nav" @itemClick="navClick"></left-nav>
    </div>
    <div class="f1">
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

</style>