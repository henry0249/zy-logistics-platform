<template>
  <loading-box v-model="loadingText" class="g-order-container">
    <div class="g-order-body" v-if="!bodyLoading">
      <div class="my-title">订单{{order.no}}调度</div>
      <el-alert title="订单信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <Info :val="order" :edit="false"></Info>
      <el-alert title="订单商品信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <goods-table :order="order" :edit="false"></goods-table>
      <el-alert title="订单物流链" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <div v-for="item in goods" :key="item.id">
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
            item.transportTrains.forEach((titem, trainsIndex) => {
              let trainsItem = JSON.parse(JSON.stringify(titem));
              delete trainsItem.origin;
              delete trainsItem.destination;
              if (trainsItem.transfer && trainsItem.transfer instanceof Array) {
                trainsItem.transfer = trainsItem.transfer[trainsItem.transfer.length-1];
              }else{
                delete trainsItem.transfer;
              }
              if (trainsItem.transfer2 && trainsItem.transfer2 instanceof Array) {
                trainsItem.transfer2 = trainsItem.transfer2[trainsItem.transfer2.length-1];
              }else{
                delete trainsItem.transfer2;
              }
              if (trainsIndex === 0) {
                trainsItem.origin = item.value.mfrs.area._id;
              }
              if (trainsIndex === item.transportTrains.length - 1) {
                trainsItem.destination = this.order.area._id;
              }
              trainsItem.logistics.forEach((litem, lindex) => {
                delete litem.origin;
                delete litem.destination;
                if (trainsIndex === 0) {
                  litem.origin = item.value.mfrs.area._id;
                }
                if (trainsIndex === item.transportTrains.length - 1) {
                  litem.destination = this.order.area._id;
                }
                if (trainsItem.transfer) {
                  litem.transfer = trainsItem.transfer;
                }
                if (trainsItem.transfer2) {
                  litem.transfer2 = trainsItem.transfer2;
                }
              });
              transportTrains.push(trainsItem);
            });
          });
          console.log(transportTrains);
          await this.$ajax.post("/order/dispatch", {
            order: this.$route.params._id,
            transportTrains: transportTrains
          });
          // this.$router.push("/order/distribution");
        }
      } catch (error) {
        console.log(error);
      }
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