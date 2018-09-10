<template>
  <div style="padding: 3% 5%;margin:0 auto">
    <stock-info @submit="submit"></stock-info>
  </div>
</template>

<script>
import StockInfo from "./StockInfo.vue";
export default {
  components: {
    StockInfo
  },
  data() {
    return {
      data: {}
    };
  },
  methods: {
    submit(data) {
      
    }
  },
};
</script>

<style scoped>
</style>