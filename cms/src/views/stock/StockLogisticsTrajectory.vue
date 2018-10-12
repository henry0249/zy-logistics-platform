<template>
  <div style="max-height:400px;overflow:auto;" class="ja">
    <stock-logistics-distrbution-step v-if="$attrs.logistics.length > 0" style="width:33%;" :val="logisticsTrajectoryData"></stock-logistics-distrbution-step>
    <stock-logistics-distrbution-map v-if="$attrs.logistics.length > 0" style="width:65%;" :logisticsTrajectory="logisticsTrajectory" :logistics="$attrs.logistics || []"></stock-logistics-distrbution-map>
    <div v-if="$attrs.logistics.length === 0" style="color:#909399;font-size:13px">无物流信息</div>
  </div>
</template>

<script>
  import stockLogisticsDistrbutionStep from './stockLogisticsDistrbutionStep.vue';
  import stockLogisticsDistrbutionMap from './stockLogisticsDistrbutionMap.vue';
  export default {
    components: {
      stockLogisticsDistrbutionStep,
      stockLogisticsDistrbutionMap
    },
    props: {
      logisticsTrajectory: {
        type: Array,
        default () {
          return [];
        }
      },
    },
    data() {
      return {
        logisticsTrajectoryData: [],
      }
    },
    created() {
      if (this.logisticsTrajectory[this.logisticsTrajectory.length - 1]) {
        if (this.logisticsTrajectory[this.logisticsTrajectory.length - 1].type !== 0) {
          this.logisticsTrajectoryData = JSON.parse(JSON.stringify(this.logisticsTrajectory)).reverse();
        } else {
          this.logisticsTrajectoryData = JSON.parse(JSON.stringify(this.logisticsTrajectory));
        }
      }
    }
  }
</script>

<style scoped>

</style>