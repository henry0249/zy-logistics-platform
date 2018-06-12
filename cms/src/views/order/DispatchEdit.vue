<template>
  <loading-box v-model="loadingText" style="min-height:calc(100vh-50px)">
    <div class="g-order-container" v-if="!loadingText">
      <Info title="订单调度" :data.sync="order"></Info>
      <goods-table :order="order" :data.sync="goods" style="margin-top:15px"></goods-table>
    </div>
  </loading-box>
</template>

<script>
import Info from "./Info.vue";
import GoodsTable from "./GoodsTable.vue";
export default {
  components: {
    Info,
    GoodsTable
  },
  data() {
    return {
      loadingText: "",
      order: {},
      goods: []
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
</style>