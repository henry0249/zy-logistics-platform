<template>
  <div>
    <goods-category :sys="false"></goods-category>
  </div>
</template>

<script>
import GoodsCategory from '../sys/goods/GoodsCategory.vue';
  export default {
    components: {
      GoodsCategory
    }
  }
</script>

<style scoped>

</style>