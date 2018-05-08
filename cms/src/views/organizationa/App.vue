<template>
  <div class="g-goods flex">
    <div v-sticky="{stickyTop:40}" class="g-goods-nav">
      <div style="padding:1px">
        <div @click="active(item,index)" v-if="item.io" v-ripple class="nav-item flex ac" v-for="(item,index) in nav" :key="index">
          <div>
            {{item.name}}
          </div>
          <div class="f1"></div>
          <div style="padding-right:10px">
            <span v-if="item.count!==undefined" style="font-size:10px" slot="badge">{{item.count}}</span>
          </div>
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
  // sys:
  // platform_admin
  // company_admin
  export default {
    components: {},
    data() {
      return {
        activeIndex: 0,
        nav: [{
          name: '平台管理',
          color: 'red',
          icon: 'pages',
          path: '/organizationa/platform',
          io: false,
          key: 'platformIo'
        }, {
          name: '公司管理',
          color: 'orange',
          path: '/organizationa/company',
          icon: 'question_answer',
          io: false,
          key: 'companyIo'
        }, {
          name: '用户管理',
          icon: 'group',
          path: '/organizationa/user',
          color: 'green',
          io: false,
          key: 'userIo'
        }]
      }
    },
    watch: {
      $route(val) {
        let io = true
        console.log(val);
        this.nav.forEach((item, index) => {
          if (val.path == item.path) {
            this.activeIndex = index
            io = false
          }
        });
        if (io) {
          this.activeIndex = null
        }
      }
    },
    methods: {
      active(item, index) {
        console.log(index);
        this.activeIndex = index
        this.$router.push({
          path: item.path,
          params: {
            index: index
          }
        })
        console.log(this.$route);
      },
      getProps(data) {
        console.log(data);
      },
      getpower() {
        let res = this.powerFilter(this.user)
        this.nav.forEach(item => {
          for (const k in res) {
            if (res.hasOwnProperty(k)) {
              if (item.key == k) {
                item.io = res[k]
              }
            }
          }
        });
        console.log(this.nav);
      }
    },
    created() {
      this.getpower()
      this.nav.forEach((item, index) => {
        if (item.path == this.$route.path) {
          this.activeIndex = index
        }
      });
    }
  }
</script>

<style scoped>
  .g-goods {
    min-height: 100vh;
    width: calc(100% - 10%);
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
    transition: all .5s;
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
    border-left: 2px solid #42A5F5;
  }
</style>