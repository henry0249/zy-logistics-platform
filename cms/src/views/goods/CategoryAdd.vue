<template>
  <div>
    <category-add :sys="false"></category-add>
  </div>
</template>

<script>
import CategoryAdd from '../sys/goods/GoodsCategoryAdd.vue';
  export default {
    components: {
      CategoryAdd
    }
  }
</script>

<style scoped>

</style>