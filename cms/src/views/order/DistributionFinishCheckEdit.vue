<template>
  <Edit ref="edit" title="调度完成审核" newState="beforeSettleCheck" submitText="推送结算审核">
    <el-button size="small" type="danger" slot="toolLeft">返回配送</el-button>
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