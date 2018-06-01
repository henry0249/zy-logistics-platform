<template>
  <div>
    <my-table size="mini" height="100vh - 50px" index selection :loadmore="loadmore" :thead="thead" :data.sync="data">
      <div slot="header">
        <el-button type="primary" @click="show=true">添加区域</el-button>
      </div>
    </my-table>
    <el-dialog title="`添加区域`" :visible.sync="show">
      <add-area></add-area>
    </el-dialog>
  </div>
</template>

<script>
  import AddArea from './AddArea';
  export default {
    components: {
      AddArea
    },
    data() {
      return {
        show: false,
        thead: {
          key: '行政编码',
        },
        data: []
      }
    },
    methods: {
      loadmore() {}
    },
  }
</script>

<style scoped>

</style>