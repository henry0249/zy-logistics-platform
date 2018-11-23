<template>
  <loading-box v-model="loadingText" class="body-padding">
    <div class="g-order-body" v-if="show">
      <div class="my-title">订单<span style="color:#409EFF;font-weight:600">{{order.no}}</span>{{title}}</div>
      <div style="margin-top:15px" v-if="order.checkFail">
        <el-alert :title="`${formatTime(order.checkFailData.createdAt)} ${field.Order.checkFail.option[order.checkFail]}：${order.checkFailData.remark}`" type="error" show-icon :closable="false">
        </el-alert>
      </div>
      <Info :val="order" :data.sync="orderAsync"></Info>
      <div class="common-margin"></div>
      <goods-table :order="orderAsync"></goods-table>
      <div class="common-margin"></div>
      <div v-if="infoEditAble && order && order._id" class="flex ac" style="margin-top:10px">
        <div class="info">
          <i class="el-icon-info"></i> 提交将更新并且保存订单基础信息
        </div>
        <div class="f1"></div>
        <el-button size="small" type="success" @click="update('info')">提交订单信息</el-button>
      </div>
      <div v-if="business" class="common-margin"></div>
      <business-trains @update="update" v-if="business  && orderAsync.goods && orderAsync.goods._id" :val="order.businessTrains" :order="orderAsync" :data.sync="businessTrainsData" :settle="businessSettle" :editAble="businessEditAble">
      </business-trains>
      <div v-if="transport" class="common-margin"></div>
      <transport-trains @update="update" v-if="transport && orderAsync.area && orderAsync.area._id" :editAble="transportEditAble" :val="order.transportTrains" :order="orderAsync" :data.sync="transportTrainsData" :settle="transportSettle" @reflesh="reflesh"></transport-trains>
    </div>
    <el-alert v-if="alert" style="margin-top:15px" :title="alert" type="info" center show-icon :closable="false">
    </el-alert>
    <div class="flex ac" style="margin:15px 0">
      <div style="padding-right:10px" v-if="order.state !== 'salesman'">
        <el-button type="danger" size="small" @click="checkFail">回退修改</el-button>
      </div>
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
    submitText: {
      type: String,
      default: "审核通过"
    },
    business: {
      type: Boolean,
      default: false
    },
    transport: {
      type: Boolean,
      default: false
    },
    businessSettle: {
      type: Boolean,
      default: false
    },
    transportSettle: {
      type: Boolean,
      default: false
    },
    infoEditAble: {
      type: Boolean,
      default: true
    },
    businessEditAble: {
      type: Boolean,
      default: true
    },
    transportEditAble: {
      type: Boolean,
      default: true
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
      show: false,
      orderAsync: {},
      businessTrainsData: [],
      transportTrainsData: [],
      order: {}
    };
  },
  methods: {
    reflesh() {
      this.getOrderInfo();
    },
    async getOrderInfo() {
      this.show = false;
      this.loadingText = "正在获取订单数据";
      try {
        this.order = await this.$ajax("/order/info/" + this.$route.params._id);
      } catch (error) {}
      setTimeout(() => {
        this.loadingText = "";
        this.show = true;
      }, 200);
    },
    object2id(obj) {
      if (obj && obj.constructor === Object && obj._id) {
        return obj._id;
      } else {
        return obj;
      }
    },
    async update(type) {
      this.loadingText = "正在提交";
      let update = {};
      if (type === "info") update = { ...this.orderAsync };
      if (type === "businessTrains") {
        update._id = this.order._id;
        update.businessTrains = [];
        this.businessTrainsData.map(item => {
          let pushItem = {};
          for (const key in item) {
            pushItem[key] = this.object2id(item[key]);
          }
          update.businessTrains.push(pushItem);
        });
      }
      if (type === "transportTrains") {
        update._id = this.order._id;
        update.transportTrains = [];
        this.transportTrainsData.map(item => {
          let pushItem = {};
          for (const key in item) {
            pushItem[key] = this.object2id(item[key]);
          }
          update.transportTrains.push(pushItem);
        });
      }
      try {
        await this.$ajax.post(`/order/update/${type}`, update);
        this.$message.success(`提交成功,正在更新`);
        await this.getOrderInfo();
      } catch (error) {}
      this.loadingText = "";
    },
    async submit() {
      if (!this.newState) {
        this.$message.error(`非法的审核状态`);
        return;
      }
      this.loadingText = "正在提交";
      try {
        await this.$ajax.post("/order/check", {
          _id: this.order._id,
          state: this.newState
        });
        this.back();
      } catch (error) {}
      this.loadingText = "";
    },
    checkFail() {
      this.$prompt("请输入回退原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "原因不能为空",
        inputPattern: /\S/
      })
        .then(async ({ value }) => {
          this.loadingText = "提交中";
          try {
            await this.$ajax.post("/order/checkFail", {
              _id: this.order._id,
              text: value
            });
            this.back();
          } catch (error) {}
          this.loadingText = "";
        })
        .catch(() => {});
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
.common-margin {
  margin-bottom: 15px;
}
</style>