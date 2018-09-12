<template>
  <loading-box>
    <logistics-edmit-item @sub="sub"></logistics-edmit-item>
  </loading-box>
</template>

<script>
import LogisticsEdmitItem from './LogisticsEdmitItem.vue';
  export default {
    components: {
      LogisticsEdmitItem
    },
    methods: {
      sub(val){
        
      }
    }
  }
</script>

<style scoped>

</style>