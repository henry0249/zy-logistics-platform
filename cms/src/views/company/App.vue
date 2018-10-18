<template>
  <loading-box v-model="loadingText" v-if="show">
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
  </loading-box>
</template>

<script>
  import CenterNav from "../common/CenterNav.vue";
  export default {
    components: {
      CenterNav
    },
    data() {
      return {
        show: true,
        loadingText: '',
        path: "/goods/list",
        activeIndex: 0,
        nav: [],
        initNav: [{
            name: "公司信息",
            icon: "icon-xiangqing",
            path: "/company/edit"
          },
          {
            name: "账户管理",
            icon: "icon-guanliyuan",
            path: "/company/account",
            role: ["companySys", "sysAdmin"]
          },
          {
            name: "角色管理",
            icon: "icon-guanliyuan",
            path: "/company/role",
            role: ["companySys", "sysAdmin"]
          },
          {
            name: "车船管理",
            icon: "icon-guanliyuan",
            path: "/company/ship",
            role: ["companySys", "sysAdmin"]
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
      },
      company: {
        handler(val) {
          this.show = false;
          this.judgeRole();
          this.isLogisticsCompany();
          this.$router.push({path:'/company/edit'})
          this.$nextTick(() => {
            this.show = true;
          })
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
      },
      judgeRole() {
        if (!this.role.sysAdmin) {
          let data = JSON.parse(JSON.stringify(this.initNav));
          data.forEach((item, index) => {
            let io = false;
            if (item.role) {
              item.role.forEach(roleItem => {
                if (this.role[roleItem]) {
                  io = true;
                }
              });
              if (!io) {
                data.splice(index, 1);
              }
            }
          });
          this.nav = JSON.parse(JSON.stringify(data));
        } else {
          this.nav = JSON.parse(JSON.stringify(this.initNav));
        }
      },
      isLogisticsCompany() {
        let io = false;
        this.company.type.forEach(item => {
          if (item === 'logistics') {
            io = true;
          }
        });
        if (!io) {
          this.nav.forEach((navItem, index) => {
            if (navItem.name === '车船管理') {
              this.nav.splice(index, 1);
            }
          });
        }
      }
    },
    mounted() {
      this.judgeRole();
      this.isLogisticsCompany();
    },
    created() {
      this.judgeRole();
      this.isLogisticsCompany();
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