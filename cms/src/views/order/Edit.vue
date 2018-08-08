<template>
  <loading-box v-model="loadingText" class="g-order-container">
    <div class="g-order-body" v-if="!bodyLoading">
      <div class="my-title">订单<span style="color:#409EFF;font-weight:600">{{order.no}}</span>{{title}}</div>
      <Info :val="order" :data.sync="orderAsync"></Info>
      <goods-table :order="orderAsync"></goods-table>
      <business-trains :val="order.businessTrains" :order="orderAsync" :data.sync="update.businessTrains" :removelist.sync="update.businessTrainsRemove"></business-trains>
      <!-- <transport-trains disabled ref="trains" :order="order" :val="item.transportTrainsData" :data.sync="update.transportTrains" :removeTrains.sync="removeTrains" :removeLogistics.sync="removeLogistics"></transport-trains> -->
    </div>
    <el-alert v-if="alert" style="margin-top:15px" :title="alert" type="info" center show-icon :closable="false">
    </el-alert>
    <div class="flex ac" style="margin-top:15px">
      <slot name="toolLeft"></slot>
      <div class="f1"></div>
      <slot name="back">
        <el-button size="small" @click="back()">返回</el-button>
      </slot>
      <slot name="toolRight">
        <el-button size="small" type="primary" @click="submit">确定</el-button>
      </slot>
    </div>
  </loading-box>
</template>

<script>
import Info from "./Info.vue";
import GoodsTable from "./GoodsTable.vue";
import TransportTrains from "./TransportTrains";
import BusinessTrains from "./BusinessTrains";
export default {
  props: {
    title: {
      type: String,
      default: "详情"
    },
    alert: {
      type: String,
      default: ""
    },
    newState: {
      type: String,
      default: ""
    }
  },
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
      orderAsync:{},
      update: {
        businessTrains: [],
        businessTrainsRemove: [],
        transportTrains: [],
        transportTrainsRemove: [],
      },
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
    async submit() {
      if (!this.newState) {
        this.$message.error(`非法的订单状态`);
        return;
      }
      this.loadingText = "正在提交";
      try {
        this.update.state = this.newState;
        let update = {
          state:this.newState,
          order:this.orderAsync
        };
        for (const key in this.update) {
          if (this.update[key].length>0) {
            update[key] = this.update[key];
          }
        }
        console.log(update);
        // await this.$ajax.post("/order/update", update);
        // this.back();
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