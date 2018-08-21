<template>
  <div>
    <goods-brand-edmit :sys="false"></goods-brand-edmit>
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