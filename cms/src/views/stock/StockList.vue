<template>
  <loading-box v-model="loadingText" style="padding:0 3%;position: relative;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="已完成" name="finish">
      </el-tab-pane>
      <el-tab-pane label="未完成" name="ready">
      </el-tab-pane>
    </el-tabs>
    <stock-table v-if="show" :type="activeName"></stock-table>
    <div class="jc" style="position: absolute;font-size: 14px;font-weight: 500;color: #303133;right:3%;top:0;height:40px">
      <el-button size="mini" type="success">新建库存单</el-button>
    </div>
  </loading-box>
</template>

<script>
  import StockTable from "./StockTable.vue";
  export default {
    components: {
      StockTable
    },
    data() {
      return {
        activeName: "finish",
        loadingText: "",
        show: true
      };
    },
    watch: {
      activeName(val) {
        this.show = false;
        this.$nextTick(() => {
          this.show = true;
        });
      }
    }
  };
</script>

<style scoped>
  .c {
    position: absolute;
  }
</style>