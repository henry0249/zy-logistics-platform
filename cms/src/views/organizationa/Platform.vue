<template>
  <div>
    <add-header :title="title" @add="add"></add-header>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <div>这是一段信息</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <div class="p-list">
    </div>
  </div>
</template>

<script>
  import AddHeader from '../common/AddHeader';
  export default {
    components: {
      AddHeader,
    },
    data() {
      return {
        title: '添加平台',
        dialogVisible: false
      }
    },
    methods: {
      async add() {
        console.log(this.$store.state.user);
        let obj = {role:[{value:'sys'}]}
        console.log(Array.isArray(obj));
        let res = this.$powerFilter(obj)
        console.log(res);
        // this.dialogVisible = true
        // console.log(11);
        // let res = await this.$api.all('/company/add',{
        // })
      }
    },
  }
</script>

<style scoped>

</style>