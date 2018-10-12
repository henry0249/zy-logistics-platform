<template>
  <loading-box v-model="loadingText" v-if="show">
    <div style="height:calc(100vh - 50px - 35px - 35px)" class="col-flex">
      <div style="padding:2vh">
        <div class="flex ac jb" style="height:174px">
          <div style="width:24%" v-if="!loadingText" v-for="(val,key) in data" :key="val.id">
            <stock-card :type="key" :goodsData="goodsData" :goods.sync="goods" :data="val.num" :time="val.createdAt"></stock-card>
          </div>
        </div>
      </div>
      <div class="f1" style="padding:0 2vh;width:100%">
        <div class="chart-card">
          <stock-chart :goods="goods" v-if="!loadingText"></stock-chart>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import StockCard from "./StockCard.vue";
  import StockChart from "./StockChart.vue";
  export default {
    components: {
      StockCard,
      StockChart
    },
    data() {
      return {
        loadingText: "加载中...",
        goods: '',
        show: true,
        data: {}
      };
    },
    watch: {
      company: {
        async handler(val) {
          this.loadingText = "加载中...";
          try {
            await this.getGoods();
            this.goods = '';
            if (this.goodsData.length > 0) {
              this.goods = this.goodsData[0]._id;
            }
          } catch (error) {}
          this.loadingText = "";
        },
        deep: true
      },
      async goods(val) {
        this.loadingText = "加载中...";
        try {
          if (this.goodsData.length > 0) {
            await this.getLastStock();
          } else {
            this.data = {
              stock: {},
              in: {},
              out: {},
              check: {},
            };
          }
        } catch (error) {}
        this.loadingText = "";
      },
    },
    methods: {
      async getGoods() {
        this.goodsData = await this.$ajax.post('/goods/find', {
          company: this.company._id
        })
      },
      async getLastStock(val) {
        this.data = await this.$ajax.post("/stock/simpleStatistics", {
          company: this.company._id,
          goods: this.goods
        });
      }
    },
    async created() {
      this.loadingText = "加载中...";
      try {
        await this.getGoods();
        if (this.goodsData.length > 0) {
          this.goods = this.goodsData[0]._id;
        } else {
          this.data = {
            stock: {},
            in: {},
            out: {},
            check: {},
          };
        }
      } catch (error) {}
      this.loadingText = "";
    }
  };
</script>

<style scoped>
  .chart-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 2vh;
    height: 100%;
  }
</style>