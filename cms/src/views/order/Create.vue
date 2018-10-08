<template>
  <loading-box v-model="loadingText">
    <div class="body-padding" v-if="show">
      <div class="order-border">
        <div class="my-title">销售订单</div>
        <Info ref="orderInfo" selectType :data.sync="order"></Info>
        <goods-table :order.sync="order"></goods-table>
        <business-trains :order.sync="order" :data.sync="businessTrainsData"></business-trains>
      </div>
      <div class="flex ac" style="margin:30px 0">
        <div class="f1"></div>
        <el-button size="small" type="primary" @click="createOrder">创建订单</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
import Info from "./Info.vue";
import GoodsTable from "./GoodsTable.vue";
import BusinessTrains from "./BusinessTrains";
export default {
  components: {
    Info,
    GoodsTable,
    BusinessTrains
  },
  data() {
    return {
      show: true,
      loadingText: "",
      order: {},
      businessTrainsData: [],
      skipTaking: false
    };
  },
  methods: {
    async createOrder() {
      this.loadingText = "创建中...";
      try {
        if (this.skipTaking) {
          this.order.state = "dispatchCheck";
        } else {
          this.order.state = "taking";
        }
        let body = {
          order: this.order
        };
        if (this.businessTrainsData.length > 0) {
          body.businessTrains = this.businessTrainsData;
        }
        await this.$ajax.post("/order/set", body);
        await this.$store.dispatch("orderBadgeNotify");
        this.$message.success("成功创建订单");
        this.loadingText = "正在刷新";
        this.show = false;
        setTimeout(() => {
          this.loadingText = "";
          this.show = true;
        }, 100);
      } catch (error) {}
      this.loadingText = "";
    }
  }
};
</script>

<style scoped>

</style>