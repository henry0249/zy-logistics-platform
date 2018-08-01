<template>
  <loading-box v-model="loadingText" class="g-order-container">
    <div class="g-order-body" v-if="!bodyLoading">
      <div class="my-title">订单{{order.no}}完成审核</div>
      <Info :val="order"></Info>
      <goods-table :order="order" :edit="false"></goods-table>
      <el-alert title="物流链" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <div v-for="item in goods" :key="item.id">
        <transport-trains disabled :key="item.id" ref="trains" :goods="item" :order="order" :val="item.transportTrainsData" :data.sync="item.transportTrains" :removeTrains.sync="removeTrains" :removeLogistics.sync="removeLogistics"></transport-trains>
      </div>
      <el-alert title="贸易链" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <div v-for="item in goods" :key="'bs'+item.id">
        <business-trains :order="order" :goods="item"></business-trains>
      </div>
    </div>
    <el-alert style="margin:15px 0" title="订单审核后的进入待结算列表" type="info" center show-icon :closable="false">
    </el-alert>
    <div class="flex ac">
      <div class="f1"></div>
      <el-button size="small" @click="back()">返回</el-button>
      <el-button size="small" type="primary" @click="finish">审核完成</el-button>
    </div>
  </loading-box>
</template>

<script>
import Info from "./Info.vue";
import GoodsTable from "./GoodsTable.vue";
import TransportTrains from "./TransportTrains";
import BusinessTrains from './BusinessTrains';
export default {
  components: {
    Info,
    GoodsTable,
    TransportTrains,
    BusinessTrains
  },
  data() {
    return {
      loadingText: "加载中",
      bodyLoading: true,
      order: {},
      goods: [],
      removeTrains: [],
      removeLogistics: []
    };
  },
  methods: {
    async getOrderInfo() {
      this.bodyLoading = true;
      this.loadingText = "正在获取订单数据";
      try {
        this.order = await this.$ajax("/order/info/" + this.$route.params._id);
        this.goods = [];
        this.order.goods.forEach(item => {
          this.goods.push(item);
        });
      } catch (error) {}
      setTimeout(() => {
        this.loadingText = "";
        this.bodyLoading = false;
      }, 200);
    },
    async finish() {
      this.loadingText = "正在提交";
      try {
        await this.$ajax.post("/order/update", {
          order: {
            _id:this.$route.params._id,
          },
          state: "finish"
        });
        this.$router.push("/order/check");
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