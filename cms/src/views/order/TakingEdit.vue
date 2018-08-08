<template>
  <Edit title="接单确认" newState="dispatchCheck">
    <el-button size="small" type="warning" slot="toolLeft">转单</el-button>
  </Edit>
</template>

<script>
import Edit from "./Edit.vue";
export default {
  components: {
    Edit
  }
};
</script>

<style scoped>
</style>