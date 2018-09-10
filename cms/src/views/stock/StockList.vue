<template>
  <loading-box v-model="loadingText" style="padding:0 3%;position: relative;">
    <stock-table :state="activeName"></stock-table>
  </loading-box>
</template>

<script>
  import StockTable from "./StockTable.vue";
  export default {
    components: {
      StockTable
    },
    props: {
      activeName: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        loadingText: "",
      };
    }
  };
</script>

<style scoped>
  .c {
    position: absolute;
  }
</style>