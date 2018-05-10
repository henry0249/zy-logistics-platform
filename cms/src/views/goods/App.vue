<template>
  <div class="g-goods flex">
    <div>
      <left-nav></left-nav>
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
  import LeftNav from "../common/LeftNav";
  export default {
    components: {
      LeftNav
    },
    data() {
      return {
        activeIndex: 0,
        nav: [{
            name: "商品类型",
            color: "red",
            icon: "widgets"
          },
          {
            name: "商品列表",
            color: "orange",
            icon: "storage",
            count: 10
          },
          {
            name: "上架管理",
            icon: "publish",
            color: "green"
          },
          {
            name: "添加商品",
            icon: "edit",
            color: "blue"
          }
        ]
      };
    },
    methods: {
      async test() {
        let res0 = await this.$ajax.post("/test/add", {
          value: "测试"
        });
        let res = await this.$ajax.get("/field");
      }
    }
  };
</script>

<style scoped>
  .g-goods {
    /* background: #f8f9fa; */
  }
</style>