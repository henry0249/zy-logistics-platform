<template>
  <Edit v-if="this.$route.query._id"></Edit>
  <add-stock v-else></add-stock>
</template>

<script>
  import AddStock from './AddStock.vue';
  import Edit from './Edit.vue';
  export default {
    components: {
      AddStock,
      Edit
    }
  }
</script>

<style scoped>

</style>