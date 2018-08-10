<template>
  <my-table data.sync="data" :thead="thead">
  </my-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    thead:{
      type:Object,
      default(){
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods:{}
};
</script>

<style scoped>
</style>