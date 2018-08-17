<template>
  <Edit ref="edit" title="调度前审核" newState="dispatch" alert="提交后将进入调度前审核流程" submitText="审核通过">
    <el-button size="small" type="danger" slot="toolLeft">不允许审核</el-button>
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