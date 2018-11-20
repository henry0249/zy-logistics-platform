<template>
  <loading-box v-model="loadingText">
    <div class="body-padding" v-if="show">
      <div class="order-border">
        <div class="my-title">销售订单</div>
        <Info ref="orderInfo" selectType :data.sync="order"></Info>
        <div style="margin-top:15px"></div>
        <goods-table :order.sync="order"></goods-table>
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
export default {
  components: {
    Info,
    GoodsTable
  },
  data() {
    return {
      show: true,
      loadingText: "",
      order: {}
    };
  },
  methods: {
    async createOrder() {
      this.loadingText = "创建中...";
      try {
        let req = this.$refs.orderInfo.getRequestData();
        await this.$ajax.post("/order/add", {
          ...req,
          state: "salesman"
        });
        await this.$store.dispatch("getHeaderBadge");
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