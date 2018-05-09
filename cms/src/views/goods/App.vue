<template>
  <div class="g-goods flex">
    <button @click="test">{{'测试'|init}}</button>
    <div v-sticky="{stickyTop:40}" class="g-goods-nav">
      <div style="padding:1px">
        <div @click="activeIndex=index" v-ripple class="nav-item flex ac" v-for="(item,index) in nav" :key="index">
          <div>
            {{item.name}}
          </div>
          <div class="f1"></div>
          <div class="active-border" v-if="activeIndex === index">
          </div>
        </div>
      </div>
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
export default {
  data() {
    return {
      activeIndex: 0,
      nav: [
        {
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
    getProps(data) {
      console.log(data);
    },
    async test() {
      let res0 = await this.$ajax.post("/test/add", {
        value:'测试'
      });
      let res = await this.$ajax.get("/field");
    }
  }
};
</script>

<style scoped>
.g-goods {
  min-height: 100vh;
  padding: 0 5%;
  background: #f5f5f5;
  padding-top: 20px;
}
.g-goods-nav {
  width: 20%;
  margin-right: 20px;
  background: #fff;
  height: 60vh;
}
.nav-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.5s;
  /* border-bottom: 1px solid #f5f5f5; */
  position: relative;
}

.active-border {
  position: absolute;
  left: 0;
  top: 1px;
  height: calc(100% - 2px);
  width: 100%;
  background: #f5f5f5;
  z-index: -1;
  border-left: 2px solid #42a5f5;
}
</style>