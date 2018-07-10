<template>
  <loading-box v-model="loadingText" class="g-order-container">
    <div class="g-order-body" v-if="!bodyLoading">
      <div class="my-title">订单{{order.no}}接单确认</div>
      <el-alert title="订单信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <Info :val="order" :edit="false"></Info>
      <el-alert title="商品信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <goods-table :order="order" :edit="false"></goods-table>
    </div>
    <el-alert style="margin:15px 0" title="接单后订单将进入待调度列表" type="info" center show-icon :closable="false">
    </el-alert>
    <div class="flex ac">
      <div class="f1"></div>
      <el-button size="small" @click="back()">返回</el-button>
      <el-button size="small" type="primary" @click="taking">确认接单</el-button>
    </div>
  </loading-box>
</template>

<script>
import Info from "./Info.vue";
import GoodsTable from "./GoodsTable.vue";
export default {
  components: {
    Info,
    GoodsTable,
  },
  data() {
    return {
      loadingText: "加载中",
      bodyLoading: true,
      order: {},
      goods: [],
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
    async taking() {
      this.loadingText = "正在提交";
      try {
        await this.$ajax.post("/order/update", {
          order: {
            _id:this.$route.params._id,
          },
          state: "dispatch"
        });
        this.$router.push("/order/dispatch");
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