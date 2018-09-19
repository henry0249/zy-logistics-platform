<template>
  <loading-box v-model="loadingText" class="g-order-create">
    <div class="g-order">
      <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
        <strong>运单详情</strong>
      </div>
      <common-alert style="margin:15px 0">运单信息</common-alert>
      <logistics-edit-item v-if="!loadingText" :data.sync="logisticsData" :initialData="logisticsInitialData"></logistics-edit-item>
      <common-alert v-if="!loadingText" style="margin:15px 0">订单信息({{logisticsInitialData.order.type==='company'?'公司订单':'个人订单'}})</common-alert>
    </div>
    <div class="tr" style="margin-top:30px">
      <el-button size="small" type="primary" @click="sub">创建运单</el-button>
    </div>
  </loading-box>
</template>

<script>
  import LogisticsEdmitItem from './LogisticsEdmitItem.vue';
  export default {
    components: {
      LogisticsEdmitItem
    },
    data() {
      return {
        loadingText: '',
        data: {},
        logisticsData:{},
        logisticsInitialData:{}
      }
    },
    methods: {
      sub() {},
      async getLogisticsById() {
        try {
          this.loadingText = '加载中';
          this.logisticsInitialData = await this.$api.curd({
            model: 'logistics',
            curdType: "findOne",
            _id: this.$route.params._id,
            populate: [{
              path: 'order'
            }, {
              path: 'handle'
            }, {
              path: 'truck'
            }, {
              path: 'ship'
            }]
          })
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {
      this.getLogisticsById();
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>