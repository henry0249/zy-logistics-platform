<template>
  <loading-box v-model="loadingText" class="g-order-container">
    <div class="g-order-body" v-if="!loadingText">
      <Info title="订单调度" :data.sync="order"></Info>
      <div class="tc sub-title">商品信息</div>
      <goods-table :order="order" :data.sync="goods" :edit="false"></goods-table>
      <div class="tc sub-title">物流链</div>
      <transport-trains :goods="order.goods[0]" :order="order" :data.sync="transportTrainsData"></transport-trains>
    </div>
    <el-alert  style="margin:15px 0" title="调度完成后将推送至配送流程" type="info" center show-icon :closable="false">
    </el-alert>
    <div class="flex ac">
      <div class="f1"></div>
      <el-button size="small" @click="back()">返回</el-button>
      <el-button size="small" type="primary">调度完成</el-button>
    </div>
  </loading-box>
</template>

<script>
  import Info from "./Info.vue";
  import GoodsTable from "./GoodsTable.vue";
  import TransportTrains from "./TransportTrains";
  export default {
    components: {
      Info,
      GoodsTable,
      TransportTrains
    },
    data() {
      return {
        loadingText: "加载中",
        order: {},
        goods: [],
        transportTrainsData: []
      };
    },
    methods: {
      async getOrderInfo() {
        this.loadingText = "正在获取订单数据";
        try {
          this.order = await this.$ajax("/order/" + this.$route.params._id);
        } catch (error) {}
        this.loadingText = "";
      }
    },
    created() {
      this.getOrderInfo();
    }
  };
</script>

<style scoped>
  .sub-title {
    color: #aaa;
    font-size: 16px;
    padding: 15px 0;
  }
</style>