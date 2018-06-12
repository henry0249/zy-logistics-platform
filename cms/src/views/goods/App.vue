<template>
  <div class="g-goods flex">
    <div>
      <left-nav :nav="nav" :default-active="path"></left-nav>
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
        path: "/goods/list",
        activeIndex: 0,
        nav: [{
            name: "商品列表",
            color: "orange",
            icon: "icon-liebiao",
            path: "/goods/list"
          },
          {
            name: "分类管理",
            color: "orange",
            icon: "icon-fenlei",
            // path: "/goods/category"
            children: [{
              name: '一级分类',
              color: "orange",
              // icon: "icon-fenlei",
              path: '/goods/category/1'
            }, {
              name: '二级分类',
              color: "orange",
              // icon: "icon-fenlei",
              path: '/goods/category/2'
            }]
          },
          {
            name: "品牌管理",
            color: "orange",
            icon: "icon-shangbiao",
            iconSize: '15',
            path: "/goods/brand"
          }, {
            name: "添加商品",
            icon: "icon-tianjiashangpin1",
            color: "#1565C0",
            path: "/goods/add"
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
    },
    mounted() {
      this.path = this.$route.path;
    }
  };
</script>

<style scoped>
  .g-box {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .no-platform {
    margin: 0 auto;
    text-align: center;
  }
  .platform-init {
    margin-top: 20px;
    margin: 0 10px;
    display: inline-block;
    padding: 10px 15px;
    text-align: center;
    border-radius: 3px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    color: #fff;
    background: #ef5350;
    cursor: pointer;
  }
  .platform-back {
    color: #aaa;
    margin-top: 15px;
    /* font-size: 10px; */
    cursor: pointer;
    color: #2196f3;
  }
  .addBox {
    width: calc(100% - 20px);
    height: 50px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
  }
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>