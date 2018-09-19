<template>
  <div>
    <category-edit :sys="false"></category-edit>
  </div>
</template>

<script>
import CategoryEdit from '../sys/goods/GoodsCategoryEdit.vue';
  export default {
    components: {
      CategoryEdit
    }
  }
</script>

<style scoped>

</style>