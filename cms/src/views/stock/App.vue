<template>
  <loading-box v-model="loadingText">
    <center-nav  :data.sync="nav"></center-nav>
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
  </loading-box>
</template>

<script>
  import CenterNav from "../common/CenterNav";
  export default {
    components: {
      CenterNav
    },
    data() {
      return {
        loadingText: '',
        show: true,
        nav: [{
            name: "库存主页",
            icon: "icon-kucun",
            path: "/stock/home",
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
            badge: 3
          },
          {
            name: "库存记录",
            icon: "icon-lishijilu",
            path: "/stock/list",
            color: "#EF5350"
          },
        ]
      };
    },
    watch: {
      orderBadge: {
        handler: function(val) {
          this.setNav(val);
        },
        deep: true
      },
      // $route: {
      //   async handler(val) {
      //     await this.setNav(this.orderBadge);
      //   },
      //   deep: true
      // },
      company: {
        async handler(val) {
          console.log(val);
          await this.setNav(this.orderBadge);
        },
        deep: true
      }
    },
    methods: {
      async setNav(val) {
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
        } catch (error) {}
        for (const key in val) {
          this.nav.forEach((item, index) => {
            if (item.state === key) {
              item.badge = val[key];
            }
            if (item.badge || item.badge === 0) {
              this.$set(this.nav[index], 'badge', count);
            }
            this.$set(this.nav, index, item);
          });
        }
        this.loadingText = '';
      }
    },
    mounted() {
      console.log(this.company);
      this.setNav(this.orderBadge);
    },
    created() {
      // this.setNav(this.orderBadge);
    }
  };
</script>

<style scoped>

</style>