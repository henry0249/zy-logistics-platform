<template>
  <div class="flex">
    <div>
      <loading-box v-model="loadingText">
        <left-nav :nav.sync="nav"></left-nav>
      </loading-box>
    </div>
    <div class="f1 g-container">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
        </router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive">
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
        loadingText: '',
        nav: []
      };
    },
    watch: {
      $route: {
        handler(val) {
          this.setNav();
        },
        deep: true
      },
      company: {
        handler(val) {
          this.setNav();
        },
        deep: true
      }
    },
    methods: {
      async setNav() {
        this.nav = [];
        let count = 0;
        try {
          this.loadingText = '加载中';
          count = await this.$api.curd({
            model: 'stock',
            curdType: 'count',
            company: this.company._id,
            state: {
              $nin: ['finish']
            }
          })
        } catch (error) {
        }
        this.nav = [{
            name: "库存主页",
            icon: "icon-kucun",
            path: "/stock/index",
            color: "#EF5350",
          },
          {
            name: "新建库存单",
            icon: "icon-jia",
            path: "/stock/add",
            color: "#EF5350"
          },
          {
            name: "待处理库存单",
            icon: "icon-daichuli3",
            path: "/stock/ready_list",
            color: "#EF5350",
            badge: count
          },
          {
            name: "库存记录",
            icon: "icon-lishijilu",
            path: "/stock/list",
            color: "#EF5350"
          },
        ];
        this.loadingText = '';
      }
    },
    mounted() {
      this.setNav()
    }
  };
</script>

<style scoped>

</style>