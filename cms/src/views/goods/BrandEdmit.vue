<template>
  <div>
    <goods-brand-edit :sys="false"></goods-brand-edit>
  </div>
</template>

<script>
  import GoodsBrandEdmit from '../sys/goods/GoodsBrandEdmit.vue';
  export default {
    components: {
      GoodsBrandEdmit
    },
    data () {
      return {
        io:false
      }
    }
  }
</script>

<style scoped>

</style>