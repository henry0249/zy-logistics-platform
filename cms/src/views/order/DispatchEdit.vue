<template>
  <loading-box v-model="loadingText" class="g-order-container">
    <div class="g-order-body" v-if="!loadingText">
      <div></div>
      <Info title="订单调度" :data.sync="order"></Info>
      <div class="tc sub-title">商品信息</div>
      <goods-table :order="order" :data.sync="goods"></goods-table>
      <div class="tc sub-title">物流链</div>
      <transport-trains  :order="order" :data.sync="transport"></transport-trains>
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
      loadingText: "",
      order: {},
      goods: [],
      transport: []
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