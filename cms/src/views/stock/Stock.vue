<template>
  <loading-box v-model="loadingText">
    <div style="height:calc(100vh - 50px - 35px - 35px)" class="col-flex">
      <div style="padding:2vh">
        <div class="flex ac jb" style="height:174px">
          <div style="width:24%" v-for="(val,key) in data" :key="val.id">
            <stock-card :type="key" :data="val.num" :time="val.createdAt"></stock-card>
          </div>
        </div>
      </div>
      <div class="f1" style="padding:0 2vh;width:100%">
        <div class="chart-card">
          <stock-chart v-if="!loadingText"></stock-chart>
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
        loadingText: "",
        data: {}
      };
    },
    watch: {
      company: {
        handler(val) {
          this.getLastStock();
        },
        deep: true
      }
    },
    methods: {
      async getLastStock() {
        this.loadingText = "加载中...";
        try {
          this.data = await this.$ajax.post("/stock/simpleStatistics", {
            company: this.company._id
          });
        } catch (error) {}
        this.loadingText = "";
      }
    },
    mounted() {
      this.getLastStock();
    }
  };
</script>

<style scoped>
  .chart-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 2vh;
    height:100%;
  }
</style>