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
        show:true,
        loadingText: '',
        path: "/goods/list",
        activeIndex: 0,
        nav: [{
            name: "公司详情",
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
          if (this.isShowShip() === true) {
            this.changeNav();
          } else {
            this.changeNav(this.isShowShip());
          }
          this.show = true;
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
      async getRoleByUser(arr) {
        let data = [];
        try {
          data = await this.$ajax.post("/role/find", {
            user: this.user._id,
            type: {
              $in: arr
            },
            company: this.company._id
          });
        } catch (error) {}
        return data;
      },
      async getSysAdmin(item) {
        let data = [];
        try {
          data = await this.$ajax.post("/role/find", {
            user: this.user._id,
            type: "sysAdmin",
          });
        } catch (error) {}
        if (data.length === 0) {
          let arr = [];
          if (item.role) {
            item.role.forEach(roleItem => {
              if (roleItem !== 'sysAdmin') {
                arr.push(roleItem);
              }
            });
          }
          return await this.getRoleByUser(arr);
        } else {
          return data;
        }
      },
      async changeNav(val) {
        let data = val ? val : JSON.parse(JSON.stringify(this.initData));
        console.log(val, data);
        for (let index = 0; index < data.length; index++) {
          if (data[index].role) {
            let arr = await this.getSysAdmin(data[index]);
            if (arr.length === 0) {
              data.splice(index, 1);
            }
          }
        }
        this.nav = JSON.parse(JSON.stringify(data));
      },
      isShowShip() {
        let data = JSON.parse(JSON.stringify(this.initData));
        let io = false;
        data.forEach((item, index) => {
          if (item.name === '车船管理') {
            this.company.type.forEach(companyItem => {
              if (companyItem === 'logistics') {
                io = true;
              }
            });
            if (!io) {
              data.splice(index, 1);
            }
          }
        });
        if (io) {
          return io;
        } else {
          return data;
        }
      }
    },
    async mounted() {
      this.setNav(this.orderBadge);
      if (this.isShowShip() === true) {
        this.changeNav();
      } else {
        this.changeNav(this.isShowShip());
      }
    },
    created() {
      this.initData = JSON.parse(JSON.stringify(this.nav));
      if (this.isShowShip() === true) {
        this.changeNav();
      } else {
        this.changeNav(this.isShowShip());
      }
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