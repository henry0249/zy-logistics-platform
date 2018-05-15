<template>
  <div :style="boxStyle">
    <el-table :data="tableList" style="width: 100%">
      <el-table-column v-for="(item,index) in tableHeader" :key="index" :prop="item.key" :label="item.keyValue" :width="item.width>0?item.width:''">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <div slot-scope="scope">
          <slot :scope="scope.row"></slot>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      tableHeader: {
        type: Array,
        default () {
          return []
        }
      },
      tableList: {
        type: Array,
        default () {
          return []
        }
      },
      boxStyle: {
        type: [Object, String],
        default () {
          return {}
        }
      }
    },
  }
</script>

<style scoped>

</style>