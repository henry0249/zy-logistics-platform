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
  import CenterNav from "../common/CenterNav";
  export default {
    components: {
      CenterNav
    },
    data() {
      return {
        path: "/goods/list",
        activeIndex: 0,
        nav: [{
            name: '公司详情',
            icon: 'icon-xiangqing',
            path: '/company/edit'
          }
        ]
      };
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
    // watch: {
    //   company:{
    //     handler(val){
    //       this.$set(this.nav[0],'name',val.name||val.nick);
    //     },
    //     deep:true
    //   }
    // },
    // methods: {
    //   async test() {
    //     let res0 = await this.$ajax.post("/test/add", {
    //       value: "测试"
    //     });
    //     let res = await this.$ajax.get("/field");
    //   }
    // },
    // mounted() {
    //   this.path = this.$route.path;
    // },
    // created () {
    //   this.$set(this.nav[0],'name',this.company.name||this.company.nick);
    // }
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