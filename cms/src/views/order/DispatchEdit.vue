<template>
  <Edit ref="edit" title="调度" newState="distributionFinishCheck" submitText="调度完成">
    <el-button size="small" type="warning" slot="toolLeft">提交配送</el-button>
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