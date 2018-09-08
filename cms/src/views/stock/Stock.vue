<template>
  <loading-box v-model="loadingText">
    <stock-top v-if="show" @sub="sub" :loadingText.sync="loading"></stock-top>
    <div>
      <common-table v-if="show" :path="path" :thead="thead" height="100vh - 390px" style="padding:0 3%">
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
        show:true,
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
      show(val){
        console.log(val);
      }
    },
    methods: {
      sub(val){
        console.log('111111');
        this.show = val;
        this.$nextTick(()=>{
          this.show = !val;
        })
      }
    }
  };
</script>

<style scoped>
</style>