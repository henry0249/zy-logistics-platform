<template>
  <Edit ref="edit" title="结算" newState="beforeSettleCheck" submitText="完成结算">
    <el-button size="small" type="danger" slot="toolLeft">打回配送</el-button>
  </Edit>
</template>

<script>
import Edit from "./Edit.vue";
export default {
  components: {
    Edit
  },
  methods: {}
};
</script>

<style scoped>
</style>