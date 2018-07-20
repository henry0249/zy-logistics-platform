<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="my-title">销售订单</div>
        <Info ref="orderInfo" selectType :data.sync="order"></Info>
        <el-alert title="商品信息" type="info" :closable="false" style="margin:15px 0">
        </el-alert>
        <goods-table ref="orderGoods" :order="order" :data.sync="goods" style="margin-top:15px"></goods-table>
        <el-alert title="贸易链" type="info" :closable="false" style="margin:15px 0">
        </el-alert>
        <div v-for="item in goods" :key="'bs'+item.id">
          <business-trains :order="order" :goods="item"></business-trains>
        </div>
      </div>
      <div class="flex ac" style="margin-top:30px">
        跳过接单
        <el-switch v-model="skipTaking" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
        <div class="f1"></div>
        <el-button size="small" type="primary" @click="createOrder">立即创建</el-button>
        <!-- <el-button size="small" @click="back()">重置</el-button> -->
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
      loadingText: "",
      order: {},
      goods: [],
      skipTaking: true
    };
  },
  methods: {
    async createOrder() {
      if (!this.$refs.orderInfo.check()) {
        return;
      }
      if (!this.$refs.orderGoods.check()) {
        return;
      }
      this.loadingText = "创建中...";
      try {
        if (this.skipTaking) {
          this.order.state = "dispatchCheck";
        } else {
          this.order.state = "taking";
        }
        await this.$ajax.post("/order/add", {
          order: this.order,
          goods: this.goods
        });
        await this.$store.dispatch("orderBadgeNotify");
        this.$message.success("成功创建订单");
        this.$router.push("/order/dispatch");
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