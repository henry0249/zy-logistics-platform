<template>
  <loading-box v-model="loadingText">
    <stock-top :loadingText.sync="loading"></stock-top>
    <div>
      <common-table :path="path" :thead="thead" height="100vh - 390px" style="padding:0 3%">
      </common-table>
    </div>
  </loading-box>
</template>

<script>
  import StockTop from './StockTop.vue';
  export default {
    components: {
      StockTop
    },
    data() {
      return {
        loadingText: "",
        loading:'',
        updateAt: new Date(),
        historyType: "week",
        historyTypeOptions: [{
            value: "week",
            label: "最近一周"
          },
          {
            value: "month",
            label: "最近一月"
          },
          {
            value: "quarter",
            label: "最近一季度"
          },
          {
            value: "year",
            label: "最近一年"
          }
        ],
        path: "/stock/find",
        thead: {
          type: {
            name: "变化类型",
          },
          num: {
            name: "数量",
          },
          new: {
            name: "操作后库存",
          },
          dv: {
            name: "差值",
          },
          createdAt: {
            name: "操作日期",
          }
        }
      };
    },
    watch: {
      loading(val){
        console.log(val);
        this.loadingText = val;
      }
    }
  };
</script>

<style scoped>
  .line {
    height: 20px;
    width: 1px;
    background: #ccc;
  }
</style>