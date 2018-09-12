<template>
  <Edit ref="edit" title="结算前审核" newState="dispatch" alert="审核通过后将进入调度流程" submitText="审核通过" transport>
    <el-button size="small" type="danger" slot="toolLeft">审核失败</el-button>
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