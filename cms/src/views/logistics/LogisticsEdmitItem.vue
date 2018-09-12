<template>
  <div class="g-order-create">
    <div class="g-order">
      <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
        <strong>运单详情</strong>
      </div>
      <common-alert style="margin:15px 0">运单信息</common-alert>
    </div>
    <div class="tr" style="margin-top:30px">
      <el-button size="small" type="primary" @click="sub">创建运单</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        logisticsData: {}
      }
    },
    methods: {
      sub() {
        this.$emit('sub', this.logisticsData);
      }
    },
    created() {
      if (Object.keys(this.data).length > 0) {
        this.logisticsData = JSON.parse(JSON.stringify(this.data));
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
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>