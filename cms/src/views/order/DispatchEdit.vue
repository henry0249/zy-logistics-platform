<template>
  <loading-box v-model="loadingText">
    <Edit ref="edit" title="调度" transport>
      <el-button size="small" type="success" slot="toolLeft">配送完成</el-button>
      <el-button size="small" type="warning" slot="toolRight" @click="submit">提交配送</el-button>
    </Edit>
  </loading-box>
</template>

<script>
import Edit from "./Edit.vue";
export default {
  components: {
    Edit
  },
  data() {
    return {
      loadingText: ""
    };
  },
  methods: {
    async submit() {
      this.loadingText = "正在提交";
      try {
        let update = this.$refs.edit.getSubmitData();
        await this.$ajax.post("/order/dispatch", {
          order: update.order._id,
          transportTrains: update.transportTrains
        });
        this.back();
      } catch (error) {}
      this.loadingText = "";
    }
  }
};
</script>

<style scoped>
</style>