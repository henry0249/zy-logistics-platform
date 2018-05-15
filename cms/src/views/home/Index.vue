<template>
  <div class="flex index-box">
    <loading-box class="g-container index-box" v-model="loadingText">
      <div v-if="!platform" class="no-platform">
        <div class="flex center" v-if="!loadingText">
          <div class="flex center">
            <icon size="30vw">meiyoushuju</icon>
          </div>
          <div style="margin-bottom:20px;text-align: center">
            没有找到订单数据
          </div>
        </div>
      </div>
      <div v-else class="flex g-container g-index">
        <div class="flex ac filter-box">
          <div v-for="(item,index) in filterKey" :key="index" v-ripple class="filter" :class="item.io?'active-color':''" @click="filterMethods(item,index)">{{item.label}}</div>
        </div>
        <order-list v-model="loadingText"></order-list>
      </div>
    </loading-box>
  </div>
</template>

<script>
  import OrderList from './OrderList';
  export default {
    components: {
      OrderList
    },
    data() {
      return {
        loadingText: "",
        platform: "www",
        filterKey: [{
            key: 'all',
            label: '全部',
            io: true,
          },
          {
            key: 'cement',
            label: '水泥',
            io: false,
          }, {
            key: 'sand',
            io: false,
            label: '砂石'
          }, {
            key: 'board',
            io: false,
            label: '板材'
          }, {
            key: 'rebar',
            io: false,
            label: '钢筋'
          }, {
            key: 'huagong',
            io: false,
            label: '化工'
          }
        ],
      }
    },
    methods: {
      filterMethods(item, index) {
        this.filterKey.forEach((v, i) => {
          if (i == index) {
            item.io = true
          } else {
            v.io = false
          }
        });
      },
      async getData() {
        let data = {
          model: 'order',
          curdType: 'find',
        }
        try {
          this.loadingText = "加载中"
          let res = await this.$api.curd(data)
          console.log(res);
          if (res.length > 0) {} else {
            this.platform = ""
          }
          this.loadingText = ""
        } catch (error) {
          this.loadingText = ""
        }
      },
    },
    created() {
      this.getData()
    }
  }
</script>

<style scoped>
  .index-box {
    height: calc(100vh - 41px);
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .g-index {
    height: calc(100vh - 41px);
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .filter-box {
    background: #fff;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    color: #757575;
    width: calc(100% - 20px);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .filter {
    padding: 0 10px;
    color: #757575;
    border-radius: 10px;
  }
  .active-color {
    color: #519cf4
  }
  .center {
    flex-direction: column;
    justify-content: center;
    align-items: center
  }
</style>