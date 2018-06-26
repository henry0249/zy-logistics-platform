<template>
  <loading-box v-model="loadingText" class="g-order-container">
    <div class="g-order-body" v-if="!bodyLoading">
      <div class="my-title">订单调度</div>
      <el-alert title="订单信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <Info :data.sync="order" :edit="false"></Info>
      <el-alert title="订单商品信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <goods-table :order="order" :edit="false"></goods-table>
      <el-alert title="订单物流链" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <div v-for="item in goods" :key="item.id">
        <!-- <div class="tc sub-title">{{item.value.name}} 物流链</div> -->
        <transport-trains :key="item.id" ref="trains" :goods="item" :order="order" :val="item.transportTrainsData" :data.sync="item.transportTrains"></transport-trains>
      </div>
    </div>
    <el-alert style="margin:15px 0" title="确认调度后接单状态的运单将进入待配送列表" type="info" center show-icon :closable="false">
    </el-alert>
    <div class="flex ac">
      <el-button size="small" type="success">配送完成</el-button>
      <div class="f1"></div>
      <el-button size="small" @click="back()">返回</el-button>
      <el-button size="small" type="primary" @click="dispatch">确认调度</el-button>
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
      bodyLoading: true,
      order: {},
      goods: []
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
          item.transportTrains = [];
          this.goods.push(item);
        });
        // this.goods = this.order.goods;
      } catch (error) {}
      setTimeout(() => {
        this.loadingText = "";
        this.bodyLoading = false;
      }, 200);
    },
    async dispatch() {
      this.loadingText = "调度中";
      try {
        let flag = true;
        this.$refs.trains.forEach(item => {
          if (item.check() !== true) {
            flag = false;
          }
        });
        if (flag) {
          let transportTrains = [];
          this.goods.forEach(item => {
            item.transportTrains.forEach(trainsItem => {
              transportTrains.push(trainsItem);
            });
          });
          await this.$ajax.post("/order/dispatch", {
            order: this.$route.params._id,
            transportTrains: transportTrains
          });
        }
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