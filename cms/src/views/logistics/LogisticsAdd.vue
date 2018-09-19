<template>
  <loading-box>
    <logistics-edit-item @sub="sub"></logistics-edit-item>
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