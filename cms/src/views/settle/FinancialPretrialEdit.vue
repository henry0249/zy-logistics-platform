<template>
  <Edit ref="edit" title="订单预审" newState="financialPretrial" alert="预审通过后进入账户结算流程" submitText="审核通过" transport>
    <el-button size="small" type="danger" slot="toolLeft">审核失败</el-button>
  </Edit>
</template>

<script>
import Edit from "../order/Edit";
export default {
  components: {
    Edit
  },
  methods: {}
};
</script>

<style scoped>
</style>