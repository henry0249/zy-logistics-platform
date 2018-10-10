<template>
  <loading-box style="font-size:12px">
    <div style="height:380px;overflow:auto;padding-right:10px">
      <div>
        <div class="tc" style="color:#909399" v-if="stepData.length===0"> 
          暂无物流信息
        </div>
        <el-steps size="mini" direction="vertical" :active="1" :space="90" key="step">
          <el-step :status="item.state || 'process'" icon="el-icon-location" v-for="(item,index) in stepData" :key="index">
            <div slot="icon">
              <icon v-if="item.type === 3" color="#67C23A" size="22">icon-dingwei</icon>
              <icon v-else-if="item.type === 2" size="22" color="#E6A23C" style="margin-top:3px">icon-dibiaozhongzhuan1</icon>
              <icon v-else-if="item.type === 0" size="22" color="#F56C6C" style="margin-top:5px">icon-qidian</icon>
              <icon v-else color="#909399" size="19" style="margin-top:5px">icon-wuliu</icon>
            </div>
            <div slot="title" style="font-size:12px;color:#606266" class="tf2">
              <span style="color:#909399">{{item.time | formatTime}} </span> {{item.title || item.address}}
            </div>
            <div slot="description" style="color:#909399" class="tf2">
              {{item.desc}}
            </div>
          </el-step>
        </el-steps>
      </div>
    </div>
  </loading-box>
</template>

<script>
export default {
  props: {
    val: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      stepData: [],
    };
  },
  created() {
    this.stepData = [];
    if (this.val.length > 0) {
      this.stepData = JSON.parse(JSON.stringify(this.val));
    }
  }
};
</script>

<style scoped>
</style>