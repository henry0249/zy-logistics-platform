<template>
  <loading-box v-model="loadingText" class="body-padding">
    <div class="g-order-body" v-if="!bodyLoading">
      <div class="my-title">订单<span style="color:#409EFF;font-weight:600">{{order.no}}</span>{{title}}</div>
      <Info :val="order" :data.sync="orderAsync"></Info>
      <goods-table :order="orderAsync"></goods-table>
      <business-trains :val="order.businessTrains" :order="orderAsync" :data.sync="update.businessTrains"></business-trains>
      <transport-trains v-if="orderAsync.area && orderAsync.area._id && transport" :val="order.transportTrains" :order="orderAsync" :data.sync="update.transportTrains"></transport-trains>
    </div>
    <el-alert v-if="alert" style="margin-top:15px" :title="alert" type="info" center show-icon :closable="false">
    </el-alert>
    <div class="flex ac" style="margin:15px 0">
      <slot name="toolLeft"></slot>
      <div class="f1"></div>
      <slot name="back">
        <el-button size="small" @click="back()">返回</el-button>
      </slot>
      <slot name="toolRight">
        <el-button size="small" type="primary" @click="submit">{{submitText}}</el-button>
      </slot>
    </div>
  </loading-box>
</template>

<script>
import Info from "./Info.vue";
import GoodsTable from "./GoodsTable.vue";
import BusinessTrains from "./BusinessTrains";
import TransportTrains from "./TransportTrains";
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
    },
    transport: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: "提交"
    }
  },
  components: {
    Info,
    GoodsTable,
    BusinessTrains,
    TransportTrains
  },
  data() {
    return {
      loadingText: "加载中",
      bodyLoading: true,
      orderAsync: {},
      update: {
        businessTrains: [],
        transportTrains: []
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
    getSubmitData() {
      let data = {
        state: this.newState,
        order: this.orderAsync
      };
      for (const key in this.update) {
        if (this.update[key].length > 0) {
          data[key] = this.update[key];
        }
      }
      return data;
    },
    async submit() {
      if (!this.newState) {
        this.$message.error(`非法的订单状态`);
        return;
      }
      this.loadingText = "正在提交";
      try {
        let update = this.getSubmitData();
        update.state = this.newState;
        await this.$ajax.post("/order/set", update);
        this.back();
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