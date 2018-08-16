<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create" v-if="show">
      <div class="g-order">
        <div class="my-title">销售订单</div>
        <Info ref="orderInfo" selectType :data.sync="order"></Info>
        <goods-table :order.sync="order"></goods-table>
        <business-trains titleTip="(计划时贸易链可选填)" :order.sync="order" :data.sync="businessTrainsData"></business-trains>
      </div>
      <div class="flex ac" style="margin-top:30px">
        跳过接单
        <el-switch v-model="skipTaking" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
        <div class="f1"></div>
        <el-button size="small" type="primary" @click="createOrder">立即创建</el-button>
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
      // if (!this.$refs.orderInfo.check()) {
      //   return;
      // }
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
.g-order-create {
  padding: 3% 5%;
}
.g-order {
  margin: 0 auto;
  padding: 30px;
  /* box-shadow: 0 0 10px rgba(0,0,0,.2); */
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>