<template>
  <loading-box>
    <logistics-edit-item @sub="sub"></logistics-edit-item>
  </loading-box>
</template>

<script>
import LogisticsEditItem from './LogisticsEditItem.vue';
  export default {
    components: {
      LogisticsEditItem
    },
    methods: {
      sub(val){
        
      }
    }
  }
</script>

<style scoped>

</style>