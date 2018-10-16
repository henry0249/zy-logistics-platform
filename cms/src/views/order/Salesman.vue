<template>
  <div>
    <List v-if="!$route.params._id" state="salesman"></List>
    <loading-box v-model="loadingText" v-if="$route.params._id">
      <Edit newState="salesmanManager" ref="edit">
        <el-button size="small" type="warning" slot="toolLeft" @click="dialogVisible = true">转单</el-button>
      </Edit>
      <el-dialog title="选择订单转入公司" :visible.sync="dialogVisible" width="35%">
        <div>
          <my-select title="选择转入公司" label="转入公司" company :data.sync="transferCompany"></my-select>
          <el-alert title="转单成功后,本公司将无法处理此订单,交由转入公司处理!" type="warning" center show-icon :closable="false" style="margin-top:15px">
          </el-alert>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="transfer">确认转入</el-button>
        </div>
      </el-dialog>
    </loading-box>
  </div>
</template>

<script>
  import List from "./List.vue";
  import Edit from "./Edit.vue";
  export default {
    components: {
      List,
      Edit
    },
    data() {
      return {
        loadingText: "",
        dialogVisible: false,
        transferCompany: {}
      };
    },
    methods: {
      async transfer() {
        if (!this.transferCompany._id) {
          this.$message.warn(`转入公司未选择`);
          return;
        }
        this.dialogVisible = false;
        this.loadingText = "加载中...";
        let data = this.$refs.edit.getSubmitData();
        try {
          this.$ajax.post("/order/transfer", {
            transferCompany: this.transferCompany._id,
            ...data,
            order: data.order._id
          });
          this.$message.success(`转单成功!`);
          this.back();
        } catch (error) {}
        this.loadingText = "";
      }
    }
  };
</script>

<style scoped>

</style>