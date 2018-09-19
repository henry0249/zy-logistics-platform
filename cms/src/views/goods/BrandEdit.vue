<template>
  <div>
    <goods-brand-edit :sys="false"></goods-brand-edit>
  </div>
</template>

<script>
  import GoodsBrandEdit from '../sys/goods/GoodsBrandEdit.vue';
  export default {
    components: {
      GoodsBrandEdit
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