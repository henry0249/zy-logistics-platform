<template>
  <div class="g-goods flex">
    <div>
      <left-nav :nav="nav"></left-nav>
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
      nav: [
        {
          name: "商品类型",
          color: "red",
          icon: "ec"
        },
        {
          name: "商品列表",
          color: "orange",
          icon: "icon-liebiao",
          path:'/goods/list'
        },
        {
          name: "上架管理",
          icon: "icon-shangjia3",
          color: "green"
        },
        {
          name: "添加商品",
          icon: "icon-tianjiashangpin1",
          color: "#1565C0"
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

</style>